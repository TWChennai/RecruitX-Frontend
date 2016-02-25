angular.module('recruitX')
  .controller('scheduleInterviewController', ['$timeout', '$rootScope', '$state', 'MasterData', '$scope', '$stateParams', '$cordovaDatePicker', 'recruitFactory', '$filter', 'dialogService', function ($timeout, $rootScope, $state, MasterData, $scope, $stateParams, $cordovaDatePicker, recruitFactory, $filter, dialogService) {
    'use strict';

    // TODO: Inline later - currently not working - need to figure out why so.
    $scope.interviewRounds = MasterData.getInterviewTypes();

    var interviewRoundsAsMap = $scope.interviewRounds.map(function (interviewRound) {
      return interviewRound.priority;
    });
    var MIN_PRIORITY = Math.min.apply(Math, interviewRoundsAsMap);
    var MAX_PRIORITY = Math.max.apply(Math, interviewRoundsAsMap);

    var currentInterviewScheduledAfterNextInterview = function (scheduleDateTime, nextInterviewTime) {
      return (scheduleDateTime > nextInterviewTime.setHours(nextInterviewTime.getHours() - 1));
    };

    var currentInterviewScheduledBeforePreviousInterview = function (scheduleDateTime, previousInterviewTime) {
      return (previousInterviewTime === undefined || scheduleDateTime < previousInterviewTime.setHours(previousInterviewTime.getHours() + 1));
    };

    var isCurrentInterviewScheduledClashWithSamePriorityInterview = function(scheduleDateTime, otherRoundTime) {
      var otherRoundTimeTemp = new Date(otherRoundTime);
      return !((scheduleDateTime <= otherRoundTime.setHours(otherRoundTime.getHours() - 1)) || (scheduleDateTime >= otherRoundTimeTemp.setHours(otherRoundTimeTemp.getHours() + 1)));
    };

    var getNextInterviewRounds = function(currentInterview) {
      return ($filter('filter')($scope.interviewRounds, {
        priority: currentInterview.priority + 1,
        dateTime: '!!'
      }));
    };

    var redirectToHomePage = function () {
      $timeout(function () {
        for (var interviewIndex in $scope.interviewRounds) {
          $scope.interviewRounds[interviewIndex].dateTime = undefined;
        }
        $rootScope.$broadcast('clearFormData');
        $rootScope.$broadcast('loaded:masterData');
      });
      $state.go('panelist-signup');
    };

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

        var otherRoundsWithSamePriority = ($filter('filter')($scope.interviewRounds, function(interviewRound) {
          return (interviewRound.priority === currentInterviewRound.priority) && (interviewRound.id !== currentInterviewRound.id);
        }));

        var nextInterviewRounds = getNextInterviewRounds(currentInterviewRound);

        var result1 = $scope.checkWithPreviousRound(dateTime, currentInterviewRound, previousInterviewRound);
        var result2 = $scope.checkWithNextRound(dateTime, currentInterviewRound, nextInterviewRounds);
        var result3 = $scope.checkWithRoundOfSamePriority(dateTime, currentInterviewRound, otherRoundsWithSamePriority);
        if (angular.equals({}, result1)) {
          if (angular.equals({}, result2)) {
            if (angular.equals({}, result3)) {
              $scope.interviewRounds[index].dateTime = dateTime;
            } else {
              dialogService.showAlert('Invalid Selection', result3.message);
            }
          } else {
            dialogService.showAlert('Invalid Selection', result2.message);
          }
        } else {
          dialogService.showAlert('Invalid Selection', result1.message);
        }
      });
    };

    $scope.checkWithPreviousRound = function (scheduleDateTime, currentInterviewRound, previousInterviewRound) {
      var error = {};
      var currentPriority = currentInterviewRound.priority;
      var previousInterviewTime = {};
      if (currentPriority > MIN_PRIORITY) {
        previousInterviewTime = previousInterviewRound.dateTime === undefined ? undefined : new Date(previousInterviewRound.dateTime);
        if (currentInterviewScheduledBeforePreviousInterview(scheduleDateTime, previousInterviewTime)) {
          error.message = 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name;
        }
      }
      return error;
    };

    $scope.checkWithNextRound = function (scheduleDateTime, currentInterviewRound, nextInterviewRounds) {
      var error = {};
      if (nextInterviewRounds.length === 0) {
        return error;
      }
      var nextInterviewRound = $scope.getInterviewWithMinStartTime(nextInterviewRounds);
      var currentPriority = currentInterviewRound.priority;
      var nextInterviewTime = {};
      if (currentPriority < MAX_PRIORITY) {
        nextInterviewTime = new Date(nextInterviewRound.dateTime);
        if (currentInterviewScheduledAfterNextInterview(scheduleDateTime, nextInterviewTime)) {
          error.message = 'Please schedule this round atleast 1hr before  ' + nextInterviewRound.name;
        }
      }
      return error;
    };

    $scope.checkWithRoundOfSamePriority = function(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority) {
      var error = {};
      if (otherRoundsWithSamePriority.length === 0) {
        return error;
      }
      var otherRoundWithSamePriority = $scope.getInterviewWithMinStartTime(otherRoundsWithSamePriority);
      if (otherRoundWithSamePriority.dateTime === undefined) {
        return error;
      }
      var otherRoundTime = {};
      otherRoundTime = new Date(otherRoundWithSamePriority.dateTime);
      if (isCurrentInterviewScheduledClashWithSamePriorityInterview(scheduleDateTime, otherRoundTime)) {
        error.message = 'Please schedule this round atleast 1hr before/after ' + otherRoundWithSamePriority.name;
      }
      return error;
    };

    $scope.getInterviewWithMinStartTime = function(interviews) {
      var minInterview = interviews[0];
      for (var i = 0; i < interviews.length; i++) {
        var minDate = minInterview.dateTime;
        if (interviews[i].dateTime < minDate) {
          minInterview = interviews[i];
        }
      }
      return minInterview;
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

    $scope.cancelInterviewSchedule = function () {
      dialogService.askConfirmation('Discard Changes', 'Do you want to discard the changes and go back ?', redirectToHomePage);
    };

    $scope.postCandidate = function () {
      $stateParams.candidate.interview_rounds = [];
      var interviewRounds = [];
      for (var interviewRoundIndex in $scope.interviewRounds) {
        if ($scope.interviewRounds[interviewRoundIndex].dateTime !== undefined) {
          var dateTime = $scope.interviewRounds[interviewRoundIndex].dateTime;
          interviewRounds[interviewRoundIndex] = ({
            'interview_type_id': $scope.interviewRounds[interviewRoundIndex].id,
            'start_time': dateTime
          });
        }
      }

      // Eliminate null, undefined, false from the array
      $stateParams.candidate.interview_rounds = interviewRounds.filter(function (interviewRound) {
        return Boolean(interviewRound);
      });

      recruitFactory.saveCandidate($stateParams, function() {
        // console.log(response);
        dialogService.showAlertWithDismissHandler('Success', 'Candidate Interview successfully added!!', redirectToHomePage);
      }, function(response) {
        var errors = response.data.errors;
        dialogService.showAlertWithDismissHandler('Failed', errors[0].reason);
      });
    };

    $scope.isCancelable = function (currentInterview) {
      if (currentInterview.dateTime === undefined) {
        return false;
      }
      var nextInterviewRounds = getNextInterviewRounds(currentInterview);
      for (var i = 0; i < nextInterviewRounds.length; i++) {
        if (nextInterviewRounds[i].dateTime !== undefined) {
          return false;
        }
      }
      return true;
    };

    $scope.cancel = function ($event, interview) {
      $event.stopPropagation();
      interview.dateTime = undefined;
    };
  }]);
