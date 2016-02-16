angular.module('recruitX')
  .controller('candidateInterviewsController', ['MasterData', '$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', '$cordovaDatePicker', 'dialogService', function (MasterData, $state, $filter, $rootScope, $scope, $stateParams, recruitFactory, $cordovaDatePicker, dialogService) {
    'use strict';

    $scope.interviews = [];
    $scope.interviewSet = [];
    $scope.notScheduled = 'Not Scheduled';
    $scope.interviewTypes = MasterData.getInterviewTypes();

    recruitFactory.getCandidateInterviews($stateParams.id, function (interviews) {
      $scope.interviews = interviews;
      $scope.buildInterviewScheduleList();
    });

    $scope.buildInterviewScheduleList = function () {
      var interviewStartTime = $scope.notScheduled;
      var interviewID = '';
      var interviewType;

      for (var interviewsIndex in $scope.interviewTypes) {
        interviewStartTime = $scope.notScheduled;
        interviewID = '';
        interviewType = $scope.interviewTypes[interviewsIndex];

        var scheduledInterview = ($filter('filter')($scope.interviews, {
          interview_type_id: interviewType.id
        }));

        if (scheduledInterview[0] !== undefined) {
          interviewStartTime = scheduledInterview[0].start_time;
          interviewID = scheduledInterview[0].id;
        }
        $scope.interviewSet.push({
          id: interviewID,
          name: interviewType.name,
          priority: interviewType.priority,
          start_time: interviewStartTime
        });
      }
      $scope.interviewSet = $filter('orderBy')($scope.interviewSet, 'start_time');
    };

    $scope.isNotScheduled = function (interviewData) {
      return interviewData.start_time === $scope.notScheduled;
    };

    $scope.viewInterviewDetails = function (interviewType) {
      return $scope.isNotScheduled(interviewType) ? '#' : 'interview-details({id:interviewType.id})';
    };

    $scope.dateTime = function (index, event) {
      event.stopPropagation();

      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        minDate: (new Date()).valueOf()
      };

      $cordovaDatePicker.show(options).then(function (dateTime) {
        if(dateTime !== undefined) {
          var currentInterviewRound = $scope.interviewTypes[index];
          var currentPriority = currentInterviewRound.priority;

          var nextLowerPriorityInterviewRounds = ($filter('filter')($scope.interviewSet, {
            priority: currentPriority - 1
          }));
          var previousInterviewRound = nextLowerPriorityInterviewRounds[0];

          var nextHigherPriorityInterviewRounds = ($filter('filter')($scope.interviewSet, {
            priority: currentPriority + 1
          }));
          var nextInterviewRound = nextHigherPriorityInterviewRounds[0];

          if ($scope.checkWithPreviousRound(dateTime, currentInterviewRound, previousInterviewRound)) {
            if($scope.checkWithNextRound(dateTime, currentInterviewRound, nextInterviewRound)) {
              $scope.interviewSet[index].start_time = dateTime;
              recruitFactory.updateInterviewSchedule({interview: {start_time: dateTime}}, $scope.interviewSet[index].id, function(response) {
                dialogService.showAlert('Update Success', response.data.success);
              }, function(response) {
                dialogService.showAlert('Update Failed', response.data.errors.start_time);
              });
            }
            else {
              dialogService.showAlert('Invalid Selection', 'Please schedule this round atleast 1hr before  ' + nextInterviewRound.name);
            }
          } else {
            dialogService.showAlert('Invalid Selection', 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name);
          }
        }
      });
    };

    $scope.checkWithPreviousRound = function(scheduleDateTime, currentInterviewRound, previousInterviewRound) {
      var currentPriority = currentInterviewRound.priority;
      var previousInterviewTime = {};
      if (currentPriority > 1) {
        previousInterviewTime = previousInterviewRound.start_time === undefined ? undefined : new Date(previousInterviewRound.start_time);
        return !(previousInterviewTime === undefined || scheduleDateTime <= previousInterviewTime.setHours(previousInterviewTime.getHours() + 1));
      }
      return true;
    };

    $scope.checkWithNextRound = function(scheduleDateTime, currentInterviewRound, nextInterviewRound) {
      var currentPriority = currentInterviewRound.priority;
      var nextInterviewTime = {};
      if (currentPriority < 4) {
        nextInterviewTime = nextInterviewRound.start_time === undefined ? undefined : new Date(nextInterviewRound.start_time);
        return !(nextInterviewTime === undefined || scheduleDateTime >= nextInterviewTime.setHours(nextInterviewTime.getHours() - 1));
      }
      return true;
    };
  }
]);
