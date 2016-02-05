angular.module('recruitX')
  .controller('candidateProfileController', ['MasterData', '$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function (MasterData, $state, $filter, $rootScope, $scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.candidate = {};
    $scope.roles = MasterData.getRoles(); // TODO: Is this required now?
    $rootScope.candidate_id = $stateParams.id;    // TODO: Should we even be storing anything on rootScope?

    recruitFactory.getCandidate($rootScope.candidate_id, function (response) {
      $scope.candidate = response.data;
    }, function (response) {
      console.log('failed with response: ' + response);
    });
  }
]);
