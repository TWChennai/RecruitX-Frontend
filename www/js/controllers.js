angular.module('controllers', [])

.controller('createCandidateProfileController', function ($scope) {
  'use strict';

  $scope.candidate = {
    java: false,
    csharp: false,
    ruby: false,
    python: false,
    other: false
  };
  
  $scope.validateForm = function () {
    return !($scope.candidate.java || $scope.candidate.csharp || $scope.candidate.ruby || $scope.candidate.python || ($scope.candidate.other)) || $scope.candidateForm.$invalid;
  };
})

.controller('scheduleInterviewController', function($scope){
});
