angular.module('recruitX')
  .controller('candidateProfileController', ['$state', '$rootScope', '$scope', '$stateParams', 'recruitFactory', function ($state, $rootScope, $scope, $stateParams, recruitFactory) {
    'use strict';

    $scope.candidate = {};

    recruitFactory.getCandidate($stateParams.candidate_id, function (candidate) {
      $scope.candidate = candidate;
    }, function (response) {
      console.log('failed with response: ' + response);
    });

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });
  }
]);
