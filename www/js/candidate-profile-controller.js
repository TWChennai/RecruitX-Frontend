angular.module('starter')
  .controller('candidateProfileController', ['$scope', '$stateParams', 'recruitFactory', function($scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.candidate = {};

    recruitFactory.getCandidate($stateParams.candidate_id, function(response) {
      $scope.candidate = response['data'];
    }, function(response) {
      console.log('failed');
      console.log(response);
    });
  }, ]);
