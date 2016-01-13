angular.module('starter')

.controller('scheduleInterviewController', function($scope, $stateParams, $cordovaDatePicker){
  'use strict';
  $scope.interviewRounds = [
               {name:'CodePairing'},
               {name:'Technical1'},
               {name:'Technical2'},
               {name:'Leadership'},
               {name:'P3'}
           ];
  $scope.dateTime = function(args) {
      var options = {
            date: new Date(),
            mode: 'datetime'
            };
    $cordovaDatePicker.show(options).then(function(dateTime) {
    $scope.interviewRounds[args].time = dateTime/8;
  });
  };
  console.log("Hello:"+JSON.stringify($stateParams));
});
