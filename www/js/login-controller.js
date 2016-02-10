angular.module('recruitX')
.controller('loginController', function ($scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore, recruitFactory) {
  'use strict';

  oktaSigninWidget.renderEl({
    el: '#okta-login-container'
  },
  function (res) {
    if (res.status === 'SUCCESS') {
      recruitFactory.isRecruiter(res.user.profile.login.split('@')[0], function(response){
      loggedinUserStore.storeUser(res.user, response.is_recruiter);

      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('panelist-signup');
    });
    }
  });
});
