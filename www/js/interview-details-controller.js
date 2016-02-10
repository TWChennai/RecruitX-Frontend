angular.module('recruitX')
  .controller('interviewDetailsController', ['$cordovaFileTransfer', '$scope', '$stateParams', 'recruitFactory', '$rootScope', '$cordovaToast', 'Camera', 'loggedinUserStore', function ($cordovaFileTransfer, $scope, $stateParams, recruitFactory, $rootScope, $cordovaToast, Camera, loggedinUserStore) {
    'use strict';

    $scope.interview = {};
    $scope.imageURI = 'img/image_upload_icon.png';
    $scope.previewDisabled = true;

    $scope.formatPanelists = function (panelists) {
      return panelists.join(', ');
    };

    recruitFactory.getInterview($stateParams.id, function (interview) {
      $scope.interview = interview;
      $scope.interview.formattedPanelists = $scope.formatPanelists($scope.interview.panelists);
    });

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
      var panelists = $scope.interview.panelists;
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
      return !((interviewStartTime <= currentTime) && $scope.isValidPanelist());
    };

    $scope.getPhoto = function () {
      Camera.getPicture().then(function (imageURI) {
        $scope.imageURI = imageURI;
        $scope.previewDisabled = false;
      }, function (err) {
        $cordovaToast.showShortBottom('Something went wrong while accessing the camera.');
      });
    };

    $scope.previewImage = function () {
      cordova.plugins.disusered.open($scope.imageURI, function () {}, function (err) {
        $cordovaToast.showShortBottom('Something went wrong while opening the image.');
      });
    };

    $scope.saveFeedback = function () {
      upload($scope.imageURI);
    };

    function upload(nativeURL) {
      var options = {
        fileKey: "avatar",
        fileName: "image.png",
        chunkedMode: false,
        mimeType: "image/png"
      };
      $cordovaFileTransfer.upload("http://10.16.20.138:4000/feedbacks", nativeURL, options).then(function(result) {
        console.log("SUCCESS upload: " + JSON.stringify(result));
      }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
        // constant progress updates
        console.log('IN PROGRESS');
      });
    }

    $scope.downloadPhoto = function () {
      var url = "http://10.16.20.138:4000/feedbacks";
      var filename = "feedback.png";
      var targetPath = cordova.file.externalRootDirectory + filename;
      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
        console.log('Success' + JSON.stringify(result));
        $scope.imageURI = result.nativeURL;
        $scope.previewDisabled = false;
      }, function (error) {
        console.log('Error');
      }, function (progress) {
        // PROGRESS HANDLING GOES HERE
      });
    };
}]);
