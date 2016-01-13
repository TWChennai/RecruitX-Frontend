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
            mode: 'datetime',
            allowOldDates: false,
            locale: 'en_in'
            };
    $cordovaDatePicker.show(options).then(function(dateTime) {

     var date = new Date(dateTime);
     var hours = date.getHours();
     var ampm = hours >= 12 ? 'pm' : 'am';
     hours = hours % 12;
     hours = hours ? hours : 12;
    $scope.interviewRounds[args].time =  date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '  ' + hours + ':' + date.getMinutes() + " " + ampm;
  });
  };
  console.log("Hello:"+JSON.stringify($stateParams));
});
