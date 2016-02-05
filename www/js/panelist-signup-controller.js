angular.module('recruitX')
  .controller('panelistSignupController', function ($scope, recruitFactory, skillHelperService, utiityHelperService, $ionicPopup, loggedinUserStore) {
    'use strict';

    $scope.items = [];
    $scope.isRefreshing = true;
    $scope.loggedinUserName = loggedinUserStore.userFirstName();

    $scope.finishRefreshing = function () {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.doManualRefresh = function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      $scope.doRefresh();
    };

    $scope.doRefresh = function () {
      console.log('AM refreshing');
      recruitFactory.getInterviews({}, function (newItems) {
        $scope.items = newItems;
        $scope.finishRefreshing();
        console.log('AM success' + $scope.items);
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
      recruitFactory.getMyInterviews({}, function (newItems) {
        $scope.myinterviews = newItems;
        $scope.finishRefreshing();
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.signingUp = function (item) {
      $scope.logged_in_user = 'recruitx'; // TODO: need to retrieve from okta
      $scope.interview_panelist = {
        interview_panelist: {
          'panelist_login_name': $scope.logged_in_user,
          'interview_id': item.id
        }
      };
      recruitFactory.signUp($scope.interview_panelist, function (res) {
        console.log(res);
        utiityHelperService.showAlert('Sign up', 'Thanks for signing up for this interview!');
        recruitFactory.getMyInterviews({}, function (newItems) {
          $scope.myinterviews = newItems;
        });
      }, function (error) {
        utiityHelperService.showAlert('Sign up', error.errors[0].reason);
      });
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      console.log('View loaded!');
      $scope.doManualRefresh();
    }, false);
  });
