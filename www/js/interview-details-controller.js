angular.module('recruitX')
  .controller('interviewDetailsController', ['$filter', 'ionicLoadingService', 'MasterData', '$q', 'Upload', 'dialogService', 'endpoints', '$cordovaFileTransfer', '$scope', '$stateParams', 'recruitFactory', '$rootScope', '$cordovaToast', 'Camera', 'loggedinUserStore', function ($filter, ionicLoadingService, MasterData, $q, Upload, dialogService, endpoints, $cordovaFileTransfer, $scope, $stateParams, recruitFactory, $rootScope, $cordovaToast, Camera, loggedinUserStore) {
    'use strict';

    $scope.interviewStatus = MasterData.getInterviewStatus();
    $scope.interview = {};
    $scope.imageURIs = [];
    $scope.BLOBs = [];
    var UNPROCESSABLE_ENTITY_STATUS = 422;

    $scope.feedbackImages = [
      {
        label: 'Areas of strength',
        URI: 'img/image_upload_icon.png',
        previewDisabled: true,
        isDownloaded: false
      },
      {
        label: 'Areas to improve',
        URI: 'img/image_upload_icon.png',
        previewDisabled: true,
        isDownloaded: false
      }
    ];

    var baseUrl = 'http://' + endpoints.apiUrl;
    var fileServerURL = baseUrl + '/interviews/' + $stateParams.id + '/feedback_images';

    $scope.finishRefreshing = function () {
      ionicLoadingService.stopLoading();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.manuallyRefreshInterviews = function () {
      ionicLoadingService.showLoading();
      $scope.refreshInterviewFeedback();
    };

    // $scope.imageURI = 'img/image_upload_icon.png';

    $scope.canSubmit = function () {
      var feedbackUploaded = ($filter('filter')($scope.feedbackImages, {
        previewDisabled: false
      }));

      return ($scope.feedBackResult !== undefined && feedbackUploaded !== undefined && feedbackUploaded.length !== 0);
    };

    $scope.refreshInterviewFeedback = function () {
      recruitFactory.getInterview($stateParams.id, function (interview) {
        $scope.interview = interview;
        if (interview.feedback_images.length !== 0) {
          $scope.feedbackImages = interview.feedback_images;
        }
        $scope.finishRefreshing();
      });
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      $scope.refreshInterviewFeedback();
    }, false);


    // TODO: This should come from the backend
    $scope.endTime = function (startTime) {
      var endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      return endTime;
    };

    $scope.extractFeedback = function (feedBack) {
      $scope.feedBackResult = feedBack;
    };

    $scope.isValidPanelist = function () {
      var panelists = $scope.interview.panelistsArray;
      var isPanelist = false;
      angular.forEach(panelists, function (panelist) {
        if (panelist === loggedinUserStore.userId()) {
          isPanelist = true;
        }
      });
      return isPanelist;
    };

    $scope.canNotEnterFeedBack = function () {
      var currentTime = new Date();
      var interviewStartTime = new Date($scope.interview.start_time);
      return !((interviewStartTime <= currentTime) && $scope.isValidPanelist()) || $scope.isFeedbackAvailable();
    };

    $scope.isFeedbackAvailable = function () {
      return $scope.interview.status !== undefined;
    };

    $scope.getPhoto = function (index) {
      Camera.getPicture().then(function (imageURI) {
        var feedbackImage = $scope.feedbackImages[index];
        feedbackImage.URI = imageURI;
        feedbackImage.previewDisabled = false;
        $scope.imageURIs.push(imageURI);
      }, function (err) {
        $cordovaToast.showShortBottom(err);
      });
    };

    $scope.previewImage = function (index) {
      var feedbackImage = $scope.feedbackImages[index];
      cordova.plugins.disusered.open(feedbackImage.URI, function () {}, function (err) {
        console.log(err);
        $cordovaToast.showShortBottom('Something went wrong while opening the image.');
      });
    };

    $scope.saveFeedback = function () {
      console.log('IN SAVE');
      dialogService.askConfirmation('Confirm', 'Are you sure you want to submit?', $scope.uploadFeedback);
    };

    $scope.uploadFeedback = function () {
      $scope.promises = [];
      $scope.isUploadComplete = false;
      if ($scope.imageURIs && $scope.imageURIs.length) {
        $scope.fileIndex = {};
        for ($scope.fileIndex in $scope.imageURIs) {
          $scope.promises.push(Upload.urlToBlob($scope.imageURIs[$scope.fileIndex]));
        }
        $q.all($scope.promises).then(function (data) {
          for (var index in data) {
            $scope.BLOBs.push(data[index]);
          }
          $scope.uploadFiles();
        });
      }
    };

    $scope.uploadFiles = function () {
      Upload.upload({
        url: fileServerURL,
        headers: {
          'Content-Type': 'image/jpeg'
        },
        data: {
          feedback_images: $scope.BLOBs,
          status_id: $scope.feedBackResult.id
        }
      }).then(function (response) {
        dialogService.showAlertWithDismissHandler('Success!!', 'Upload was successful', $scope.refreshInterviewFeedback);
      }, function (error, status) {
        if (status === UNPROCESSABLE_ENTITY_STATUS) {
          dialogService.showAlert('Sign up', error.errors[0].reason);
        } else {
          $cordovaToast.showShortBottom('Something went wrong while processing your request. Please try again soon.');
        }
      });
    };

    $scope.downloadPhoto = function (index) {
      var filename = $scope.feedbackImages[index].file_name;
      var targetPath = cordova.file.externalRootDirectory + filename;
      $cordovaFileTransfer.download(fileServerURL + '/' + filename, targetPath, {}, true).then(function (result) {
        $scope.feedbackImages[index].URI = result.nativeURL;
        $scope.feedbackImages[index].isDownloaded = true;
      }, function (error) {
        console.log('Error', error);
        $cordovaToast.showShortBottom(error);
      }, function (progress) {
        // PROGRESS HANDLING GOES HERE
        console.log(progress);
      });
    };
  }]);
