angular.module('starter')
 .controller('panelistSignupController', function($scope, $http) {
    'use strict';

    $scope.items = [1,2,3,4,5,6];

    $scope.doRefresh = function() {
      console.log("AM refreshing");
      $http.get('http://192.168.1.106:4000/candidates')
        .success(function(newItems) {
          $scope.items = newItems;
          console.log("AM success");
        })
        .error(function(error){
          alert("hey error!!")
          console.log("AM error");
        })
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    };
 })

  .controller('interviewDetailsController', function() {
	});
