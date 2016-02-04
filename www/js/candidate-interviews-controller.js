angular.module('recruitX')
  .controller('candidateInterviewsController', ['$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function ($state, $filter, $rootScope, $scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.interviews = [];
    $scope.interviewSet = [];
    $scope.notScheduled = 'Not Scheduled';

    recruitFactory.getCandidateInterviews($stateParams.id, function (interviews) {
      $scope.interviews = interviews;
      $scope.buildInterviewScheduleList();
    });

    $scope.buildInterviewScheduleList = function () {
      var interviewStartTime = $scope.notScheduled;
      var interviewID = '';
      var interviewRoundName = '';
      
      for (var interviewsIndex in $rootScope.interview_types) {
        interviewStartTime = $scope.notScheduled;
        interviewID = '';
        interviewRoundName = $rootScope.interview_types[interviewsIndex].name;

        var scheduledInterview = ($filter('filter')($scope.interviews, {
          interview_type: {
            name: interviewRoundName
          }
        }));
        if (scheduledInterview[0] !== undefined) {
          interviewStartTime = scheduledInterview[0].start_time;
          interviewID = scheduledInterview[0].id;
        }
        $scope.interviewSet.push({
          id: interviewID,
          name: interviewRoundName,
          start_time: interviewStartTime
        });
      }
    };

    $scope.isNotScheduled = function (interviewData) {
      console.log(interviewData.start_time === $scope.notScheduled);
      return interviewData.start_time === $scope.notScheduled;
    };

    $scope.viewInterviewDetails = function (interviewRound) {
      return $scope.isNotScheduled(interviewRound) ? '#' : 'interview-details({id:interviewRound.id})';
    };
  }
]);
