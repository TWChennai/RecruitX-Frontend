angular.module('recruitX')
  .controller('candidateProfileController', ['$scope', '$stateParams', 'recruitFactory', 'skillHelperService', '$rootScope', function ($scope, $stateParams, recruitFactory, skillHelperService, $rootScope) {
    'use strict';

    $scope.candidate = {};
    var candidate_id = $stateParams.id;

    recruitFactory.getCandidate(candidate_id, function (response) {
      $scope.candidate = response.data;
      $scope.candidate.role = $rootScope.roles[response.data.role_id];
      $scope.candidate.all_skills = skillHelperService.getAllSkills($scope.candidate.skills, $scope.candidate.other_skills);
    }, function(response) {
      console.log('failed with response: ' + response);
    });

    recruitFactory.getInterviews({candidate_id: candidate_id}, function(interviews) {
      $scope.interviews = interviews;
    });
  }
]);
