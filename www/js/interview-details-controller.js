angular.module('recruitX')
  .controller('interviewDetailsController', ['$filter', 'ionicLoadingService', 'MasterData', '$q', 'Upload', 'dialogService', 'apiUrl', '$cordovaFileTransfer', '$scope', '$stateParams', 'recruitFactory', '$rootScope', '$cordovaToast', 'Camera', 'loggedinUserStore', 'apiKey', '$state', 'deployChannel','$ionicAnalytics', function ($filter, ionicLoadingService, MasterData, $q, Upload, dialogService, apiUrl, $cordovaFileTransfer, $scope, $stateParams, recruitFactory, $rootScope, $cordovaToast, Camera, loggedinUserStore, apiKey, $state, $ionicAnalytics, deployChannel) {
    'use strict';

    $scope.interviewStatus = MasterData.getInterviewStatuses();
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

    var fileServerURL = apiUrl + '/interviews/' + $stateParams.interview_id + '/feedback_images';

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
      return $scope.feedBackResult !== undefined;
    };

    $scope.refreshInterviewFeedback = function () {
      recruitFactory.getInterview($stateParams.interview_id, function (interview) {
        $scope.interview = interview;
        if (interview.status) {
          $scope.feedbackImages = interview.feedback_images;
        }
        $scope.finishRefreshing();
        if(!$scope.interview.previous_interview_status) {
          $cordovaToast.showShortBottom('Feedback for the previous round was not submitted');
        }
      }, function () {
        $state.go('tabs.interviews');
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
      for (var panelistIndex in panelists) {
        if (panelists[panelistIndex] === loggedinUserStore.userId()) {
          isPanelist = true;
        }
      }
      return isPanelist;
    };

    $scope.canNotEnterFeedBack = function () {
      if(deployChannel === 'production') {
        $ionicAnalytics.track('Interview Details', {
          is_recruiter: loggedinUserStore.isRecruiter()
        });
      }
      var currentTime = new Date();
      var interviewStartTime = new Date($scope.interview.start_time);
      return !($scope.interview.previous_interview_status && (interviewStartTime <= currentTime) && (loggedinUserStore.isRecruiter() || $scope.isValidPanelist())) || $scope.isFeedbackAvailable();
    };

    $scope.canRemovePanelist = function() {
      var currentTime = new Date();
      var interviewStartTime = new Date($scope.interview.start_time);
      return loggedinUserStore.isRecruiter() && interviewStartTime > currentTime;
    };

    $scope.removingPanelist = function ($event, interview_panelist) {
      $event.stopPropagation();
      $scope.interview_panelist_id = interview_panelist.interview_panelist_id;
      dialogService.askConfirmation('Remove', 'Are you sure you want to remove '+ interview_panelist.name +' ?', $scope.removePanelist);
    };

    $scope.removePanelist = function () {
      recruitFactory.removeInterviewPanelist($scope.interview_panelist_id, $scope.removePanelistSuccessHandler, $scope.removePanelistUnprocessableEntityHandler, $scope.defaultErrorHandler);
    };

    var successHandler = function (header, message) {
      $scope.finishRefreshing();
      dialogService.showAlertWithDismissHandler(header, message, function () {
        $scope.manuallyRefreshInterviews();
      });
    };

    $scope.removePanelistSuccessHandler = function () {
      successHandler('Remove', 'Successfully removed panelist for this interview');
    };

    $scope.isFeedbackAvailable = function () {
      return $scope.interview.status !== undefined;
    };

    $scope.removePanelistUnprocessableEntityHandler = function (error) {
      unprocessableEntityHandler(error, 'Remove');
    };

    var unprocessableEntityHandler = function (error, header) {
      $scope.finishRefreshing();
      dialogService.showAlert(header, getFirstErrorInReadableForm(error.errors)).then(function () {
        $scope.manuallyRefreshInterviews();
      });
    };

    $scope.defaultErrorHandler = function () {
      $scope.finishRefreshing();
    };

    $scope.getPhoto = function (index) {
      Camera.getPicture().then(function (imageURI) {
        var feedbackImage = $scope.feedbackImages[index];
        feedbackImage.URI = imageURI;
        feedbackImage.previewDisabled = false;
        $scope.imageURIs[index] = imageURI;
      }, function (err) {
        $cordovaToast.showShortBottom(err);
      });
    };

    $scope.previewImage = function (index) {
      var feedbackImage = $scope.feedbackImages[index];
      window.resolveLocalFileSystemURL(feedbackImage.URI, function () {
        cordova.plugins.disusered.open(feedbackImage.URI, function () {}, function (err) {
          // console.log(err);
          $cordovaToast.showShortBottom('Something went wrong while opening the image.');
        });
      }, function (fail) {
        // console.log('error' + fail);
      });
    };

    $scope.saveFeedback = function () {
      // console.log('IN SAVE');
      dialogService.askConfirmation('Confirm', 'Are you sure you want to submit?', $scope.uploadFeedback);
    };

    $scope.isFeedbackWithoutImage = function() {
      return $scope.isFeedbackAvailable() && !$scope.feedbackImages.length;
    };

    $scope.uploadFeedback = function () {
      $scope.promises = [];
      $scope.isUploadComplete = false;
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
    };

    $scope.uploadFiles = function () {
      Upload.upload({
        url: fileServerURL,
        headers: {
          'Authorization': window.localStorage.API_TOKEN,
          'Content-Type': 'image/jpeg'
        },
        data: {
          feedback_images: $scope.BLOBs,
          status_id: $scope.feedBackResult.id
        }
      }).then(function () {
        dialogService.showAlertWithDismissHandler('Success!!', 'Feedback submitted', $scope.refreshInterviewFeedback);
      }, function (error) {
        if (error.status === UNPROCESSABLE_ENTITY_STATUS) {
          dialogService.showAlertWithDismissHandler('Feedback', 'Error uploading Feedback',
          $scope.refreshInterviewFeedback);
        } else {
          $cordovaToast.showShortBottom('Something went wrong while processing your request. Please try again soon.');
        }
      });
    };

    $scope.downloadPhoto = function (index) {
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        var filename = $scope.feedbackImages[index].file_name;
        var targetPath = fileSystem.root.toURL() + filename + '.jpg';
        $rootScope.$broadcast('loading:show');
        $cordovaFileTransfer.download(fileServerURL + '/' + filename, targetPath, {
          headers: {
            'Authorization': apiKey
          }
        }, true).then(function (result) {
          $scope.feedbackImages[index].URI = result.nativeURL;
          $scope.feedbackImages[index].isDownloaded = true;
          $rootScope.$broadcast('loading:hide');
          refreshMedia.refresh(targetPath);
        }, function (error) {
          $cordovaToast.showShortBottom('Something went wrong while downloading the image. Please try again later.');
          $rootScope.$broadcast('loading:hide');
        }, function (progress) {
          // PROGRESS HANDLING GOES HERE
          // console.log(progress);
        });
      });
    };
  }]);
