angular.module('recruitX')
  .controller('candidateTabController', ['$state', '$stateParams', '$rootScope', '$scope', function ($state, $stateParams, $rootScope, $scope) {
    'use strict';

    $scope.candidateId = $state.params.candidate_id;
    console.log($scope.candidateId);

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
  }
]);
