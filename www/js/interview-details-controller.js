angular.module('recruitX')
  .controller('interviewDetailsController', ['$scope', '$stateParams', 'recruitFactory', '$rootScope', function ($scope, $stateParams, recruitFactory, $rootScope) {
    'use strict';

    $scope.interview = {};

    recruitFactory.getInterview($stateParams.id, function(interview) {
      $scope.interview = interview;
      $scope.interview.candidate.role = $rootScope.roles[interview.candidate.role_id];
    });

    $scope.endTime = function(startTime) {
      var endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      return endTime;
    };
  }
]);
