angular.module('recruitX')
  .controller('candidateInterviewsController', ['MasterData','$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function (MasterData, $state, $filter, $rootScope, $scope, $stateParams, recruitFactory) {
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
      var interviewRound;

      for (var interviewsIndex in $scope.interviewTypes) {
        interviewStartTime = $scope.notScheduled;
        interviewID = '';
        interviewRound = $scope.interviewTypes[interviewsIndex];

        var scheduledInterview = ($filter('filter')($scope.interviews, {
          interview_type_id: interviewRound.id
        }));

        if (scheduledInterview[0] !== undefined) {
          interviewStartTime = scheduledInterview[0].start_time;
          interviewID = scheduledInterview[0].id;
        }
        $scope.interviewSet.push({
          id: interviewID,
          name: interviewRound.name,
          start_time: interviewStartTime
        });
      }
      $scope.interviewSet = $filter('orderBy')($scope.interviewSet, 'start_time');
    };

    $scope.isNotScheduled = function (interviewData) {
      return interviewData.start_time === $scope.notScheduled;
    };

    $scope.viewInterviewDetails = function (interviewRound) {
      return $scope.isNotScheduled(interviewRound) ? '#' : 'interview-details({id:interviewRound.id})';
    };
  }
]);
