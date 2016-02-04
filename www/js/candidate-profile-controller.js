angular.module('recruitX')
  .controller('candidateProfileController', ['$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', 'skillHelperService', function ($state, $filter, $rootScope, $scope, $stateParams, recruitFactory, skillHelperService) {
    'use strict';

    $scope.candidate = {};
    // TODO: Why do we need to store the same candidate_id in both $scope and $rootScope?
    $scope.candidate_id = $stateParams.id;
    $rootScope.candidate_id = $stateParams.id;

    // $scope.go = $state.go.bind($state);

    recruitFactory.getCandidate($scope.candidate_id, function (response) {
      $scope.candidate = response.data;
      $scope.candidate.role = ($filter('filter')($rootScope.roles, {
        id: response.data.role_id
      }))[0];
      $scope.candidate.all_skills = skillHelperService.getAllSkills($scope.candidate.skills, $scope.candidate.other_skills);
    }, function(response) {
      console.log('failed with response: ' + response);
    });
  }
]);
