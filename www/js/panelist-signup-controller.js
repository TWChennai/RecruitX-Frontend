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
        $scope.finishRefreshing();
        console.log('AM error' + error);
      });
    };

    $scope.doRefresh();
  })

  .controller('interviewDetailsController', function() {
  });
