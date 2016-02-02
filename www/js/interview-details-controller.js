angular.module('starter')
  .controller('interviewDetailsController', ['$scope', '$stateParams', 'recruitFactory', function ($scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.interview = {};

    recruitFactory.getInterview($stateParams.id, function(interview) {
      $scope.interview = interview;
    });

    $scope.endTime = function(startTime) {
      var endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      return endTime;
    };
  }
]);
