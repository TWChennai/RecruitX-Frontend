angular.module('recruitX')

.controller('loginController', function($scope, $state, oktaSigninWidget, loggedinUserStore) {
    oktaSigninWidget.renderEl(
      { el: '#okta-login-container' },
      function (res) {
        if (res.status === 'SUCCESS') {
            loggedinUserStore.storeUser(res.user);
            $state.go('panelist-signup');
        }
      }
    );
});
