angular.module('recruitX')
  .controller('candidateTabController', ['$state', '$filter', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function ( $state, $filter, $rootScope, $scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.intvsTab = function(event){
      $state.transitionTo('candidate-interviews', {
        id: $rootScope.candidate_id
      });
    };
  }
]);
