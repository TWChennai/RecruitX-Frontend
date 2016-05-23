angular.module('recruitX')
  .controller('CandidateTabsCtrl', ['interviewTypeHelperService', 'MasterData', '$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', '$cordovaDatePicker', 'dialogService', 'loggedinUserStore', function (interviewTypeHelperService, MasterData, $state, $filter, $rootScope, $scope, $stateParams, recruitFactory, $cordovaDatePicker, dialogService, loggedinUserStore) {
    'use strict';

    $scope.candidateId = $state.params.candidate_id;
    $scope.roleId = $state.params.role_id;
    $scope.candidate = {};
    $scope.selectedSlotId = null;
    $scope.interviews = [];
    $scope.interviewSet = [];
    $scope.isPanelistForAnyInterviewRound = false;
    $scope.notScheduled = 'Not Scheduled';
    $scope.noInterviews = true;
    $scope.interviewTypes = interviewTypeHelperService.constructRoleInterviewTypesMap($scope.roleId);
    $scope.isLoggedinUserRecruiter = loggedinUserStore.isRecruiter();
    $scope.isLoggedinUserSuperUser = loggedinUserStore.isSuperUser();
    $scope.loggedinUser = loggedinUserStore.userId();

    $scope.fetchCandidateInterviews = function () {
      recruitFactory.getCandidateInterviews($scope.candidateId, function (interviews) {
        $scope.interviews = interviews;
        if (interviews.length === 0) {
          $scope.noInterviews = true;
          $scope.current_candidate = undefined;
        } else {
          $scope.noInterviews = false;
          $scope.current_candidate = $scope.interviews[0].candidate;
        }
        $scope.buildInterviewScheduleList();
      });
    };

    $scope.fetchCandidateInterviews();

    $scope.buildInterviewScheduleList = function () {
      $scope.interviewSet = [];
      for (var interviewsIndex in $scope.interviewTypes) {
        var interviewStartTime = $scope.notScheduled,
          interviewID = '',
          status = '',
          interviewType = $scope.interviewTypes[interviewsIndex];

        var scheduledInterview = ($filter('filter')($scope.interviews, {
          interview_type_id: interviewType.id
        }));

        if (scheduledInterview[0] !== undefined) {
          interviewStartTime = scheduledInterview[0].start_time;
          interviewID = scheduledInterview[0].id;
          status = scheduledInterview[0].status;
          for (var interviewPanelistIndex in scheduledInterview[0].panelists) {
            if ($scope.loggedinUser === scheduledInterview[0].panelists[interviewPanelistIndex].name) {
              $scope.isPanelistForAnyInterviewRound = true;
            }
          }
        }
        if (!(!$scope.isPipelineNotClosed() && scheduledInterview[0] === undefined)) {
          $scope.interviewSet.push({
            id: interviewID,
            name: interviewType.name,
            priority: interviewType.priority,
            interview_type_id: interviewType.id,
            start_time: interviewStartTime,
            status: status
          });
        }
        if (status !== undefined && status.name === 'Pass') {
          return;
        }
      }
    };

    $scope.isPipelineNotClosed = function () {
      return $scope.current_candidate !== undefined && $scope.current_candidate.pipelineStatus !== 'Closed';
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
          $scope.fetchCandidateInterviews();
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
      var nextPriority = currentInterview.priority + 1;
      var previousInterview = $filter('filter')($scope.interviewSet, {
        priority: previousPriority
      })[0];
      var nextInterview = $filter('filter')($scope.interviewSet, {
        priority: nextPriority
      })[0];
      return $scope.isNotScheduled(currentInterview) && (previousInterview === undefined || !$scope.isNotScheduled(previousInterview)) && (nextInterview === undefined || !$scope.isFeedbackGiven(nextInterview.status));
    };

    $scope.viewInterviewDetails = function (interviewType) {
      return $scope.isNotScheduled(interviewType) ? '#' : 'interview-details({interview_id: interviewType.id})';
    };

    $scope.isFeedbackGiven = function (status) {
      return status !== undefined && status !== '';
    };

    $scope.isPreviousRoundPursueOrStrongPursue = function (currentInterview) {
      var previousInterview = ($filter('filter')($scope.interviewSet, {
        priority: currentInterview.priority - 1
      }))[0];
      if (!previousInterview) { //need to revisit and do it in a better way
        previousInterview = ($filter('filter')($scope.interviewSet, {
          priority: currentInterview.priority - 2
        }))[0];
      }
      return previousInterview && previousInterview.status && (previousInterview.status.name === 'Pursue' || previousInterview.status.name === 'Strong Pursue');
    };

    var getPreviousRound = function(index) {
      var currentInterview = $scope.interviewSet[index];
      var previousInterviewBasedOnIndex = $scope.interviewSet[index - 1];
      if (previousInterviewBasedOnIndex.start_time === $scope.notScheduled) {
        var previousInterviewBasedOnPriority = ($filter('filter')($scope.interviewSet, {
          priority: currentInterview.priority - 1
        }))[0];
        return previousInterviewBasedOnPriority;
      }
      return previousInterviewBasedOnIndex;
    };

    $scope.showSlots = function (index, interviewType) {
      $scope.interviewSet[index].displaySlots = !$scope.interviewSet[index].displaySlots;
      if ($scope.interviewSet[index].displaySlots) {
        var previousInterview = getPreviousRound(index);
        recruitFactory.getSlots({
          interview_type_id: interviewType.interview_type_id,
          previous_rounds_start_time: previousInterview.start_time,
          role_id: $scope.roleId
        }, function(response) {
          if (response.data.length !== 0) {
            $scope.slots = response.data;
            $scope.selectedSlot = {
              id: $scope.slots[0].id
            };
          }
          else {
            $scope.interviewSet[index].displaySlots = !$scope.interviewSet[index].displaySlots;
            dialogService.showAlert('Slots', 'No slots available for this role and interview_type!');
          }

        }, function(error) {
          console.log(error);
        });
      }
    };

    $scope.convertSlotsToInterview = function() {
      recruitFactory.convertSlotsToInterview({
        slot_id: $scope.selectedSlot.id,
        candidate_id: $state.params.candidate_id
      }, function() {
        dialogService.showAlertWithDismissHandler('Slot', 'Slot has been converted to interview!', function () {
          $scope.fetchCandidateInterviews();
        });
      }, function() {
        dialogService.showAlert('Slot', 'Failed to convert Slot to interview!');
      });
    };

    $scope.compareStatus = function (interviewStatus, status) {
      return interviewStatus !== undefined && interviewStatus.name === status;
    };

    $scope.canNotSeeFeedback = function (interviewType) {
      return !(($scope.isLoggedinUserRecruiter || $scope.isPanelistForAnyInterviewRound) && !$scope.isNotScheduled(interviewType));
    };

    $scope.dateTime = function (interviewType, event, callback) {
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
          candidate_id: $scope.candidateId,
          interview_type_id: interviewType.interview_type_id,
          start_time: dateTime
        };
        callback(interview, interviewType);
      });
    };

    $scope.updateInterview = function (interview, interviewType) {
      recruitFactory.updateInterviewSchedule({
        interview: {
          start_time: interview.start_time
        }
      }, interviewType.id, function (response) {
        var index = $scope.interviewSet.indexOf(interviewType);
        $scope.interviewSet[index].start_time = response.data.start_time;
        dialogService.showAlert('Update Success', 'Updated successfully!');
      }, function (response) {
        dialogService.showAlert('Update Failed', response.data.errors.start_time);
      });
    };

    $scope.createInterview = function (interview, interviewType) {
      recruitFactory.createInterviewSchedule({
        interview: interview
      }, function (response) {
        var index = $scope.interviewSet.indexOf(interviewType);
        $scope.interviewSet[index].start_time = response.data.start_time;
        $scope.interviewSet[index].id = response.data.id;
        dialogService.showAlert('Create Success', 'Created successfully!');
      }, function (response) {
        dialogService.showAlert('Create Failed', response.data.errors.start_time);
      });
    };

    $scope.isActive = function (stateName) {
      return stateName === $state.current.name;
    };

    recruitFactory.getCandidate($scope.candidateId, function (candidate) {
      $scope.candidate = candidate;
    }, function (response) {
      console.log('failed with response: ' + response);
    });
  }]);
