angular.module('recruitX')
  .controller('scheduleInterviewController', ['$timeout', '$rootScope', '$state', 'MasterData', '$scope', '$stateParams', '$cordovaDatePicker', 'recruitFactory', '$filter', 'dialogService', function ($timeout, $rootScope, $state, MasterData, $scope, $stateParams, $cordovaDatePicker, recruitFactory, $filter, dialogService) {
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
          dialogService.showAlert('Invalid Selection', 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name);
        }
      });
    };

    $scope.isInterviewScheduleValid = function (scheduleDateTime, currentInterviewRound, previousInterviewRound) {
      var currentPriority = currentInterviewRound.priority;
      var previousInterviewTime = {};
      if (currentPriority > 1) {
        previousInterviewTime = previousInterviewRound.dateTime === undefined ? undefined : new Date(previousInterviewRound.dateTime.getTime());
        return !(previousInterviewTime === undefined || scheduleDateTime <= previousInterviewTime.setHours(previousInterviewTime.getHours() + 1));
      }

      return true;
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
          $stateParams.candidate.interview_rounds[interviewRoundIndex] = ({
            'interview_type_id': $scope.interviewRounds[interviewRoundIndex].id,
            'start_time': formattedDateTime
          });
        }
      }

      var redirectToHomePage = function () {
        $timeout(function () {
          for(var interviewIndex in $scope.interviewRounds){
            $scope.interviewRounds[interviewIndex].dateTime = undefined;
          }
          $rootScope.$broadcast('clearFormData');
          $rootScope.$broadcast('loaded:masterData');
        });
        $state.go('panelist-signup');
      };

      recruitFactory.saveCandidate($stateParams, function (res) {
        // console.log(res);
        dialogService.showAlertWithDismissHandler('Success', 'Candidate Interview successfully added!!', redirectToHomePage);
      });
    };
  }
]);
