angular.module('recruitX')
  .controller('candidateTabController', ['$state', '$filter', '$rootScope', '$scope', function ($state, $filter, $rootScope, $scope) {
    'use strict';
    var backBtn = document.querySelector('.back-button');
    backBtn.classList.remove('hide');
    $scope.intvsTab = function () {
      $state.transitionTo('candidate-interviews', {
        id: $rootScope.candidate_id
      });
    };
    backBtn.addEventListener('click', function (e) {
      e.preventDefault();
      $state.go('panelist-signup');
    });
  }
]);
