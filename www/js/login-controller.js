angular.module('recruitX')
  .controller('loginController', function ($scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore) {
    'use strict';

    oktaSigninWidget.renderEl({
      el: '#okta-login-container'
    },
    function (res) {
      if (res.status === 'SUCCESS') {
        loggedinUserStore.storeUser(res.user);
        $state.go('panelist-signup');
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
      }
    });
  });
