angular.module('starter')
.factory('Candidate', function($resource){
    'use strict';
    return $resource('http://10.16.23.151:4000/candidates/:id');
})

.controller('scheduleInterviewController', function($scope, $stateParams, $cordovaDatePicker, Candidate){

  $stateParams.candidate.rounds = [];
  var interviewMap = {};
  // the below data should be got from server
  $scope.interviewRounds = [
               {id: '1', name:'CodePairing'},
               {id: '2', name:'Technical1'},
               {id: '3', name:'Technical2'},
               {id: '4', name:'Leadership'},
               {id: '5', name:'P3'}
           ];
  $scope.dateTime = function(args) {
      var options = {
            date: new Date(),
            mode: 'datetime',
            allowOldDates: false
            };
    $cordovaDatePicker.show(options).then(function(dateTime) {
     console.log('datetime' + dateTime);
     var date = new Date(dateTime);
     console.log('date:' + date);
     var hours = date.getHours();
     var ampm = hours >= 12 ? 'pm' : 'am';
     hours = hours % 12;
     hours = hours ? hours : 12;
     var timing = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '  ' + hours + ':' + date.getMinutes() + ' ' + ampm;

     $scope.interviewRounds[args].displayDateTime = timing;
     $scope.interviewRounds[args].actualDateTime = dateTime;
     interviewMap[$scope.interviewRounds[args].id] = dateTime;
     console.log("interviewMap" + interviewMap);
     for (var i in interviewMap){
         console.log('Key in datetime() is: ' + i + '. Value is: ' + interviewMap[i]);
     }
  });
  };
  
  $scope.postCandidate = function(){
      for (var i in interviewMap){
          $stateParams.candidate.rounds.push({id:i, timei:interviewMap[i]});
          console.log('Key is: ' + i + '. Value is: ' + interviewMap[i]);
      }

    var candidate = new Candidate($stateParams);
    candidate.$save();
  }
});
