angular.module('recruitX')
  .controller('scheduleInterviewController', ['interviewTypeHelperService', '$timeout', '$rootScope', '$state', 'MasterData', '$scope', '$stateParams', '$cordovaDatePicker', 'recruitFactory', '$filter', 'dialogService', function (interviewTypeHelperService, $timeout, $rootScope, $state, MasterData, $scope, $stateParams, $cordovaDatePicker, recruitFactory, $filter, dialogService) {
    'use strict';

    var MIN_PRIORITY,MAX_PRIORITY, interviewRoundsAsMap;

    $scope.interviewRounds = [];
    // TODO: Inline later - currently not working - need to figure out why so.

    var setup = function(role_id){
      $scope.interviewRounds = interviewTypeHelperService.constructRoleInterviewTypesMap(role_id);
      interviewRoundsAsMap = $scope.interviewRounds.map(function (interviewRound) {
        return interviewRound.priority;
      });
      MIN_PRIORITY = Math.min.apply(Math, interviewRoundsAsMap);
      MAX_PRIORITY = Math.max.apply(Math, interviewRoundsAsMap);
    };

    setup($stateParams.candidate.role_id);

    var currentInterviewScheduledAfterNextInterview = function (scheduleDateTime, nextInterviewTime) {
      return (scheduleDateTime > nextInterviewTime.setHours(nextInterviewTime.getHours() - 1));
    };

    var currentInterviewScheduledBeforePreviousInterview = function (scheduleDateTime, previousInterviewTime) {
      return (previousInterviewTime === undefined || scheduleDateTime < new Date(previousInterviewTime).setHours(previousInterviewTime.getHours() + 1));
    };

    var isCurrentInterviewScheduledClashWithSamePriorityInterview = function (scheduleDateTime, otherRoundTime) {
      var otherRoundTimeTemp = new Date(otherRoundTime);
      return !((scheduleDateTime <= otherRoundTime.setHours(otherRoundTime.getHours() - 1)) || (scheduleDateTime >= otherRoundTimeTemp.setHours(otherRoundTimeTemp.getHours() + 1)));
    };

    var getInterviewRoundsWithPriority = function (priority) {
      return ($filter('filter')($scope.interviewRounds, {
        priority: priority,
        dateTime: '!!'
      }));
    };

    var getNextInterviewRounds = function (currentInterview) {
      for(var priority = currentInterview.priority+1; priority <= MAX_PRIORITY; priority++){
        var nextInterviewRounds = getInterviewRoundsWithPriority(priority);
        if (nextInterviewRounds.length !== 0) {
          return nextInterviewRounds;
        }
      }
      return [];
    };

    var clearData = function () {
      for (var interviewIndex in $scope.interviewRounds) {
        $scope.interviewRounds[interviewIndex].dateTime = undefined;
      }
    };

    var redirectToHomePage = function () {
      $timeout(function () {
        clearData();
        $rootScope.$broadcast('clearFormData');
        $rootScope.$broadcast('loaded:masterData');
      });
      $state.go('tabs.interviews');
    };

    $rootScope.$on('roleChanged', function (event, args) {
      clearData();
      setup(args.role_id);
    });

    $scope.dateTime = function (index) {
      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        minDate: (new Date()).valueOf()
      };

      $cordovaDatePicker.show(options).then(function (dateTime) {
        if (!dateTime) {
          return;
        }
        var now = new Date(Date.now());
        if (dateTime < now) {
          dialogService.showAlert('Invalid Selection', 'Should be in future');
          return;
        }
        if (dateTime > now.setMonth(now.getMonth() + 1)) {
          dialogService.showAlert('Invalid Selection', 'Should be less than a month');
          return;
        }
        var currentInterviewRound = $scope.interviewRounds[index];
        var previousInterviewRound = $scope.interviewRounds[index - 1];

        var otherRoundsWithSamePriority = ($filter('filter')($scope.interviewRounds, function (interviewRound) {
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

    var isRoundToBeIgnored = function (interviewRound) {
      return interviewRound.dateTime === undefined && interviewRound.optional;
    };

    $scope.checkWithPreviousRound = function (scheduleDateTime, currentInterviewRound, previousInterviewRound) {
      var error = {};
      var currentPriority = currentInterviewRound.priority;
      if (currentPriority > MIN_PRIORITY && !isRoundToBeIgnored(previousInterviewRound)) {
        if (currentInterviewScheduledBeforePreviousInterview(scheduleDateTime, previousInterviewRound.dateTime)) {
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
      if (currentPriority < MAX_PRIORITY && !isRoundToBeIgnored(nextInterviewRound)) {
        nextInterviewTime = new Date(nextInterviewRound.dateTime);
        if (currentInterviewScheduledAfterNextInterview(scheduleDateTime, nextInterviewTime)) {
          error.message = 'Please schedule this round atleast 1hr before  ' + nextInterviewRound.name;
        }
      }
      return error;
    };

    $scope.checkWithRoundOfSamePriority = function (scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority) {
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
      if (isCurrentInterviewScheduledClashWithSamePriorityInterview(scheduleDateTime, otherRoundTime) && !isRoundToBeIgnored(otherRoundWithSamePriority)) {
        error.message = 'Please schedule this round atleast 1hr before/after ' + otherRoundWithSamePriority.name;
      }
      return error;
    };

    $scope.getInterviewWithMinStartTime = function (interviews) {
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

      recruitFactory.saveCandidate($stateParams, function () {
        // console.log(response);
        dialogService.showAlertWithDismissHandler('Success', 'Candidate Interview successfully added!!', redirectToHomePage);
      }, function (response) {
        console.log(response);
        dialogService.showAlertWithDismissHandler('Failed', 'Failed to create candidate with given interview(s)');
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
