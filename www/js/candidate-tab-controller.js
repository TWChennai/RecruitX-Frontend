angular.module('recruitX')
  .controller('candidateTabController', ['$state', '$filter', '$rootScope', '$scope', function ($state, $filter, $rootScope, $scope) {
    'use strict';

    $scope.intvsTab = function () {
      $state.transitionTo('candidate-interviews', {
        id: $rootScope.candidate_id
      });
    };
  }
]);
