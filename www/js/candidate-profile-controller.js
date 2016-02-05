angular.module('recruitX')
  .controller('candidateProfileController', ['MasterData', '$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', 'skillHelperService', function (MasterData, $state, $filter, $rootScope, $scope, $stateParams, recruitFactory, skillHelperService) {
    'use strict';

    $scope.candidate = {};
    $scope.roles = MasterData.getRoles();
    $rootScope.candidate_id = $stateParams.id;

    recruitFactory.getCandidate($rootScope.candidate_id, function (response) {
      // TODO: Since we seem to be replicating the same intent (of matching the object from the MasterData and associating into the object),
      // can we move this into the point where the remote call is made to fetch data?
      $scope.candidate = response.data;
      $scope.candidate.role = ($filter('filter')($scope.roles, {
        id: response.data.role_id
      }))[0];
      $scope.candidate.all_skills = skillHelperService.formatAllSkills($scope.candidate.skills, $scope.candidate.other_skills);
    }, function(response) {
      console.log('failed with response: ' + response);
    });
  }
]);
