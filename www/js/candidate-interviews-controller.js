angular.module('recruitX')
  .controller('candidateInterviewsController', ['$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function ($state, $filter, $rootScope, $scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.interviews = [];
    $scope.interviewSet = [];
    $scope.notScheduled = 'Not Scheduled';

    recruitFactory.getInterviews({candidate_id: $stateParams.id}, function(interviews) {
      $scope.interviews = interviews;
      $scope.buildInterviewScheduleList();
    });

    $scope.buildInterviewScheduleList = function(){

      var interviewStartTime = $scope.notScheduled;
      var interviewID = '';
      var interviewRoundName = '';

      for (var interviewsIndex in $rootScope.interview_types) {
    // console.log('HIHIHIHIHI', $scope.interviews, '    ', $scope.interviews[interviewsIndex].interview_type.name);
      interviewStartTime = $scope.notScheduled;
      interviewID = '';
      interviewRoundName = $rootScope.interview_types[interviewsIndex].name;

    // console.log('interview rounds root scope ', $rootScope.interview_types[interviewsIndex].name);
      var scheduledInterview = ($filter('filter')($scope.interviews, {
      interview_type: {name: interviewRoundName}
    }));
    // console.log(JSON.stringify(scheduledInterview));
      if(scheduledInterview[0] !== undefined){
      interviewStartTime = scheduledInterview[0].start_time;
      interviewID = scheduledInterview[0].id;
    //  console.log('Interview Start time', interviewStartTime);
    //  console.log('Interview ID: ', interviewID);
    }

      $scope.interviewSet.push({id: interviewID, name: interviewRoundName, start_time: interviewStartTime});
      console.log(JSON.stringify($scope.interviewSet));
    }
    };

    $scope.isNotScheduled = function(interviewData){
      console.log(interviewData.start_time === $scope.notScheduled);
      return interviewData.start_time === $scope.notScheduled;
    };

    $scope.viewInterviewDetails = function(interviewRound){
      return $scope.isNotScheduled(interviewRound)?'#':'interview-details({id:interviewRound.id})';
    };
  }
]);
