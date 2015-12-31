angular.module('starter').controller('createCandidateProfileController', function ($scope) {
  $scope.candidate = {
    java: false,
    csharp: false,
    ruby: false,
    python: false
  };
  $scope.validate = function () {
    return !($scope.candidate.java || $scope.candidate.csharp || $scope.candidate.ruby || $scope.candidate.python) || $scope.candidateForm.$invalid;
  };
  $scope.redirectToScheduleInterviewPage = function () {
    if ($scope.candidateForm.$valid) {
      window.location = "schedule-interview.html";
    }
  };
})
