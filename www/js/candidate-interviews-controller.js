angular.module('recruitX')
  .controller('candidateInterviewsController', ['MasterData', '$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', '$cordovaDatePicker', 'dialogService', 'loggedinUserStore', function (MasterData, $state, $filter, $rootScope, $scope, $stateParams, recruitFactory, $cordovaDatePicker, dialogService, loggedinUserStore) {
    'use strict';

    $scope.interviews = [];
    $scope.interviewSet = [];
    $scope.isPanelistForAnyInterviewRound = false;
    $scope.notScheduled = 'Not Scheduled';
    $scope.interviewTypes = MasterData.getInterviewTypes();
    $scope.isLoggedinUserRecruiter = loggedinUserStore.isRecruiter();
    $scope.loggedinUser = loggedinUserStore.userId();

    $scope.fetchCandidateInterviews = function () {
      recruitFactory.getCandidateInterviews($stateParams.id, function (interviews) {
        $scope.interviews = interviews;
        $scope.buildInterviewScheduleList();
        if (interviews[0] === undefined) {
          recruitFactory.getCandidate($rootScope.candidate_id, function (response) {
            $scope.current_candidate = response;
          }, function (response) {
            console.log('failed with response: ' + response);
          });
        } else {
          $scope.current_candidate = $scope.interviews[0].candidate;
        }
      });
    };

    $scope.fetchCandidateInterviews();

    $scope.buildInterviewScheduleList = function () {
      for (var interviewsIndex in $scope.interviewTypes) {
        var interviewStartTime = $scope.notScheduled;
        var interviewID = '';
        var status;
        var interviewType = $scope.interviewTypes[interviewsIndex];

        var scheduledInterview = ($filter('filter')($scope.interviews, {
          interview_type_id: interviewType.id
        }));

        if (scheduledInterview[0] !== undefined) {
          interviewStartTime = scheduledInterview[0].start_time;
          interviewID = scheduledInterview[0].id;
          status = scheduledInterview[0].status;
          angular.forEach(scheduledInterview[0].panelists, function (interview_panelist) {
            if ($scope.loggedinUser === interview_panelist.name) {
              $scope.isPanelistForAnyInterviewRound = true;
            }
          });
        }
        $scope.interviewSet.push({
          id: interviewID,
          name: interviewType.name,
          priority: interviewType.priority,
          start_time: interviewStartTime,
          status: status
        });
      }
      $scope.interviewSet = $filter('orderBy')($scope.interviewSet, 'start_time');
    };

    $scope.isPipelineInProgress = function () {
      return $scope.current_candidate !== undefined && $scope.current_candidate.pipelineStatus === 'In Progress';
    };

    $scope.closePipelineWithConfirmation = function () {
      dialogService.askConfirmation('Pipeline', 'Are you sure you want to close the pipeline ?', $scope.closePipeline);
    };

    $scope.closePipeline = function () {
      var closedPipelineStatusId = (($filter('filter')(MasterData.getPipelineStatuses(), {
        name: 'Closed'
      }))[0]).id;
      var data_to_update = {
        candidate: {
          pipeline_status_id: closedPipelineStatusId
        }
      };
      recruitFactory.closePipeline(data_to_update, $scope.current_candidate.id, function () {
        dialogService.showAlertWithDismissHandler('Pipeline', 'Pipeline has been closed for this candidate', function () {
          $state.go($state.current, {}, {
            reload: true
          });
        });
      }, function () {
        dialogService.showAlert('Pipeline', 'Something went wrong while closing pipeline!');
      });
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

    $scope.isFeedbackGiven = function (status) {
      return status !== undefined;
    };

    $scope.compareStatus = function (interviewStatus, status) {
      return interviewStatus.name === status;
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
        if (dateTime === undefined) {
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

    $scope.updateInterview = function (interview, index) {
      recruitFactory.updateInterviewSchedule({
        interview: {
          start_time: interview.start_time
        }
      }, $scope.interviewSet[index].id, function (response) {
        $scope.interviewSet[index].start_time = response.data.start_time;
        dialogService.showAlert('Update Success', 'Updated successfully!');
      }, function (response) {
        dialogService.showAlert('Update Failed', response.data.errors.start_time);
      });
    };

    $scope.createInterview = function (interview, index) {
      recruitFactory.createInterviewSchedule({
        interview: interview
      }, function (response) {
        $scope.interviewSet[index].start_time = response.data.start_time;
        $scope.interviewSet[index].id = response.data.id;
        dialogService.showAlert('Create Success', 'Created successfully!');
      }, function (response) {
        dialogService.showAlert('Create Failed', response.data.errors.start_time);
      });
    };
  }
]);
