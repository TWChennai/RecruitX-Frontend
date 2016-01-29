angular.module('starter')
  .controller('panelistSignupController', function($scope, recruitFactory) {
    'use strict';

    $scope.items = [];

    $scope.isRefreshing = true;

    $scope.finishRefreshing = function() {
      $scope.isRefreshing = false;
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.doRefresh = function() {
      console.log('AM refreshing');
      recruitFactory.getCandidates(function(newItems) {
        $scope.items = newItems;
        $scope.finishRefreshing();
        console.log('AM success');
      }, function(error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      console.log('View loaded!');
      $scope.doRefresh();
    }, false);

  })

  .controller('interviewDetailsController', function() {
  });
