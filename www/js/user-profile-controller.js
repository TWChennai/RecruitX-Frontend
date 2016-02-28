angular.module('recruitX')
  .controller('UserProfileCtrl', ['$scope', 'loggedinUserStore', function ($scope, loggedinUserStore) {
    'use strict';

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      $scope.user = {
        username: loggedinUserStore.userId(),
        firstName: loggedinUserStore.userFirstName(),
        lastName: 'UNKNOWN',
        isRecruiter: loggedinUserStore.isRecruiter(),
        experience: 'UNKNOWN'
      };
    });
  }
  ]);
