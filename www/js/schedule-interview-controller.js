angular.module('starter')
.controller('scheduleInterviewController', function($scope, $stateParams, $cordovaDatePicker, recruitFactory){

  $stateParams.candidate.rounds = [];
  var interviewMap = {};
  /* Get Interview Rounds */
  recruitFactory.getInterviewRounds(function(interviewRounds){
    $scope.interviewRounds = interviewRounds;
  });
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
  //console.log($stateParams);
  //console.log(recruitFactory);
  $scope.postCandidate = function(){
    for (var i in interviewMap){
      $stateParams.candidate.rounds.push({id:i, timei:interviewMap[i]});
      console.log('Key is: ' + i + '. Value is: ' + interviewMap[i]);
    }

    //var candidate = new Candidate($stateParams);
    //candidate.$save();
    //alert('test');
    //console.log($stateParams);
    //console.log(recruitFactory);
    recruitFactory.saveCandidate($stateParams, function (res) {
      //alert(res);
      console.log(res);
    });
  }
});
