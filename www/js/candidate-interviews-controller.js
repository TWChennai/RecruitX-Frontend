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

    $scope.isNextSchedulableRound = function (currentInterview) {
      var previousPriority = currentInterview.priority - 1;
      var previousInterview = $filter('filter')($scope.interviewSet, {
        priority: previousPriority
      })[0];
      return $scope.isNotScheduled(currentInterview) && !$scope.isNotScheduled(previousInterview);
    };

    $scope.viewInterviewDetails = function (interviewType) {
      return $scope.isNotScheduled(interviewType) ? '#' : 'interview-details({id:interviewType.id})';
    };

    $scope.dateTime = function (index, event, callback) {
      event.stopPropagation();

      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        minDate: (new Date()).valueOf()
      };

      $cordovaDatePicker.show(options).then(function (dateTime) {
        if(dateTime === undefined) {
          return;
        }

        var interview = {
          candidate_id: $stateParams.id,
          interview_type_id: $scope.interviewTypes[index].id,
          start_time: dateTime
        };
        callback(interview, index);
      });
    };

    $scope.updateInterview = function(interview, index) {
      recruitFactory.updateInterviewSchedule({interview: {start_time: interview.start_time}}, $scope.interviewSet[index].id, function(response) {
        $scope.interviewSet[index].start_time = response.data.start_time;
        dialogService.showAlert('Update Success', 'Updated successfully!');
      }, function(response) {
        dialogService.showAlert('Update Failed', response.data.errors.start_time);
      });
    };

    $scope.createInterview = function(interview, index) {
      recruitFactory.createInterviewSchedule({interview: interview}, function(response) {
        $scope.interviewSet[index].start_time = response.data.start_time;
        $scope.interviewSet[index].id = response.data.id;
        dialogService.showAlert('Create Success', 'Created successfully!');
      }, function(response) {
        dialogService.showAlert('Create Failed', response.data.errors.start_time);
      });
    };
  }
]);
