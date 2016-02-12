angular.module('recruitX')
  .controller('panelistSignupController', ['$scope', 'recruitFactory', 'skillHelperService', 'ionicLoadingService', 'loggedinUserStore', 'dialogService', '$ionicHistory', '$state', function ($scope, recruitFactory, skillHelperService, ionicLoadingService, loggedinUserStore, dialogService, $ionicHistory, $state) {
    'use strict';

    $scope.items = [];
    $scope.loggedinUserName = loggedinUserStore.userFirstName();
    $scope.isLoggedinUserRecruiter = loggedinUserStore.isRecruiter();

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
      recruitFactory.getInterviews({
        panelist_login_name: loggedinUserStore.userId()
      }, function (newItems) {
        $scope.items = newItems;
        $scope.finishRefreshing();
        console.log('AM success' + $scope.items);
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.refreshMyInterviews = function () {
      recruitFactory.getMyInterviews({}, function (newItems) {
        $scope.myinterviews = newItems;
        $scope.finishRefreshing();
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.refreshCandidates = function(){
        recruitFactory.getAllCandidates(function(candidates){
          $scope.all_candidates = candidates;
          $scope.finishRefreshing();
      });
    }

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
      dialogService.showAlertWithDismissHandler('Sign up', 'Thanks for signing up for this interview!', function () {
        $scope.manuallyRefreshInterviews();
      });
    };

    $scope.signUpUnprocessableEntityHandler = function (error) {
      $scope.finishRefreshing();
      dialogService.showAlert('Sign up', error.errors[0].reason);
    };

    $scope.defaultErrorHandler = function () {
      $scope.finishRefreshing();
    };

    $scope.logout = function () {
       dialogService.askConfirmation('Logout', 'Are you sure you want to logout?', function(){
           loggedinUserStore.clearDb();
           $state.go('login');
           $ionicHistory.nextViewOptions({
             disableBack: true,
             disableAnimate: true
           });
       });
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      console.log('View loaded!');
      $scope.manuallyRefreshInterviews();
    }, false);
  }
]);
