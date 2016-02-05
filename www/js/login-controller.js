angular.module('recruitX')

.controller('loginController', function($scope, $state, $ionicHistory, oktaSigninWidget, loggedinUserStore) {
  oktaSigninWidget.renderEl(
      { el: '#okta-login-container' },
      function (res) {
        if (res.status === 'SUCCESS') {
          loggedinUserStore.storeUser(res.user);
          $ionicHistory.nextViewOptions({
              disableBack: true
            });
          $state.go('panelist-signup');
        }
      }
    );
});
