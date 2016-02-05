angular.module('recruitX')
  .controller('interviewDetailsController', ['$scope', '$stateParams', 'recruitFactory', '$rootScope', '$cordovaToast', 'Camera', function ($scope, $stateParams, recruitFactory, $rootScope, $cordovaToast, Camera) {
    'use strict';

    $scope.interview = {};
    $scope.imageURI = 'img/image_upload_icon.png';
    $scope.previewDisabled = true;

    recruitFactory.getInterview($stateParams.id, function (interview) {
      $scope.interview = interview;
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

    $scope.canNotEnterFeedBack = function () {
      var currentTime = new Date();
      var interviewStartTime = new Date($scope.interview.start_time);

      return interviewStartTime > currentTime;
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
  }
]);
