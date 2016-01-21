angular.module('starter')
.controller('scheduleInterviewController', function($scope, $stateParams, $cordovaDatePicker, recruitFactory,  $filter){
  'use strict';

  $stateParams.candidate.interview_schedule = [];
  /* Get Interview Rounds */
  recruitFactory.getInterviewRounds(function(interviewRounds){
    $scope.interviewRounds = $filter('orderBy')(interviewRounds, 'priority');
  });

  $scope.dateTime = function(index) {
    var options = {
      date: new Date(),
      mode: 'datetime',
      allowOldDates: false,
      minDate: (new Date()).valueOf()
    };

    $cordovaDatePicker.show(options).then(function(dateTime) {
      var currentPriority = $scope.interviewRounds[index].priority;
      var previousInterviewRound = $filter('filter')($scope.interviewRounds, {priority: currentPriority - 1});

      if (currentPriority > 1 && (previousInterviewRound[0].dateTime === undefined || dateTime.getTime() <= previousInterviewRound[0].dateTime)) {
          alert('Please schedule this round after ' + previousInterviewRound[0].name);
      } else {
        $scope.interviewRounds[index].dateTime = dateTime;
      }
    });
  };

  $scope.isFormInvalid = function() {
    for (var interviewRoundIndex in $scope.interviewRounds) {
      if ($scope.interviewRounds[interviewRoundIndex].dateTime !== undefined) {
        return false;
      }
    }
    return true;
  };

    $scope.postCandidate = function () {
      for (var interviewRoundIndex in $scope.interviewRounds) {
        if ($scope.interviewRounds[interviewRoundIndex].dateTime !== undefined) {
          var formattedDateTime = $filter('date')($scope.interviewRounds[interviewRoundIndex].dateTime, 'yyyy-MM-dd HH:mm:ss');
          $stateParams.candidate.interview_schedule.push({'interview_id': $scope.interviewRounds[interviewRoundIndex].id,
          'candidate_interview_date_time': formattedDateTime});
        }
      }

      recruitFactory.saveCandidate($stateParams, function (res) {
        //alert(res);
        console.log(res);
      });
    };
});
