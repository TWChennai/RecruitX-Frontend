angular.module('recruitX')
  .controller('candidateProfileController', ['$state', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function ($state, $rootScope, $scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.candidate = {};
    $rootScope.candidate_id = $stateParams.id; // TODO: Should we even be storing anything on rootScope?

    recruitFactory.getCandidate($rootScope.candidate_id, function (response) {
      $scope.candidate = response;
    }, function (response) {
      console.log('failed with response: ' + response);
    });
  }
]);
