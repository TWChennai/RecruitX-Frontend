angular.module('recruitX')
  .controller('panelistSignupController', function ($scope, recruitFactory, skillHelperService, ionicLoadingService, loggedinUserStore, alertService) {
    'use strict';

    $scope.items = [];
    $scope.loggedinUserName = loggedinUserStore.userFirstName();

    $scope.finishRefreshing = function () {
      ionicLoadingService.stopLoading();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.manuallyRefreshInterviews = function () {
      ionicLoadingService.showLoading();
      $scope.refreshInterviews();
      $scope.refreshMyInterviews();
    };

    $scope.refreshInterviews = function () {
      console.log('AM refreshing');
      recruitFactory.getInterviews({panelist_login_name: loggedinUserStore.userId()}, function (newItems) {
        $scope.items = newItems;
        $scope.finishRefreshing();
        console.log('AM success' + $scope.items);
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.refreshMyInterviews = function() {
      recruitFactory.getMyInterviews({}, function (newItems) {
        $scope.myinterviews = newItems;
        $scope.finishRefreshing();
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.signingUp = function (item) {
      $scope.interview_panelist = {
        interview_panelist: {
          'panelist_login_name': loggedinUserStore.userId(),
          'interview_id': item.id
        }
      };
      ionicLoadingService.showLoading();
      recruitFactory.signUp($scope.interview_panelist, $scope.signUpSuccessHandler, $scope.signUpUnprocessableEntityHandler, $scope.defaultErrorHandler);
    };

    $scope.signUpSuccessHandler = function (res) {
      console.log(res);
      $scope.finishRefreshing();
      alertService.showAlertWithDismissHandler('Sign up', 'Thanks for signing up for this interview!', function() {
        $scope.manuallyRefreshInterviews();
      });
    };

    $scope.signUpUnprocessableEntityHandler = function (error) {
      $scope.finishRefreshing();
      alertService.showAlert('Sign up', error.errors[0].reason);
    };

    $scope.defaultErrorHandler = function () {
      $scope.finishRefreshing();
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      console.log('View loaded!');
      $scope.manuallyRefreshInterviews();
    }, false);
  });
