angular.module('recruitX')
  .controller('scheduleInterviewController', function (MasterData, $scope, $stateParams, $cordovaDatePicker, recruitFactory, $filter, utiityHelperService) {
    'use strict';

    $stateParams.candidate.interview_rounds = [];
    // TODO: Inline later - currently not working - need to figure out why so.
    $scope.interviewRounds = MasterData.getInterviewTypes();

    $scope.dateTime = function (index) {
      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        minDate: (new Date()).valueOf()
      };

      $cordovaDatePicker.show(options).then(function (dateTime) {
        var currentInterviewRound = $scope.interviewRounds[index];
        var currentPriority = currentInterviewRound.priority;

        var nextLowerPriorityInterviewRounds = ($filter('filter')($scope.interviewRounds, {
          priority: currentPriority - 1
        }));
        var previousInterviewRound = nextLowerPriorityInterviewRounds[0];

        if ($scope.isInterviewScheduleValid(dateTime, currentInterviewRound, previousInterviewRound)) {
          $scope.interviewRounds[index].dateTime = dateTime;
        } else {
          utiityHelperService.showAlert('Invalid Selection', 'Please schedule this round after  ' + previousInterviewRound.name);
        }
      });
    };

    $scope.isInterviewScheduleValid = function (scheduleDateTime, currentInterviewRound, previousInterviewRound) {
      var currentPriority = currentInterviewRound.priority;
      return !(currentPriority > 1 && (previousInterviewRound.dateTime === undefined || scheduleDateTime <= previousInterviewRound.dateTime));
    };

    $scope.isFormInvalid = function () {
      // TODO: Use some built-in functionality from angular for this
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
          var minuteToMilliSecond = 60000;
          var dateTime = $scope.interviewRounds[interviewRoundIndex].dateTime;
          var formattedDateTime = $filter('date')(dateTime.getTime() + dateTime.getTimezoneOffset() * minuteToMilliSecond, 'yyyy-MM-dd HH:mm:ss');
          $stateParams.candidate.interview_rounds.push({
            'interview_type_id': $scope.interviewRounds[interviewRoundIndex].id,
            'interview_date_time': formattedDateTime
          });
        }
      }

      recruitFactory.saveCandidate($stateParams, function (res) {
        console.log(res);
        utiityHelperService.showAlert('Success', 'Candidate data has been successfully submitted!!');
      });
    };
  });
