xdescribe('panelistSignupController', function () {
  'use strict';

  beforeEach(module('recruitX'));
  var loggedinUserStore, state, ionicHistory, createController, scope;

  beforeEach(inject(function ($controller, _loggedinUserStore_, $state, $ionicHistory, $rootScope) {
     spyOn(_loggedinUserStore_, 'userFirstName').and.returnValue('recruitx');
     spyOn(_loggedinUserStore_, 'isRecruiter').and.returnValue(true);
     scope = $rootScope.$new();
     loggedinUserStore = _loggedinUserStore_;
     state = $state;
     ionicHistory = $ionicHistory;
     createController = function(){
       $controller('panelistSignupController', {
       $scope: scope,
       loggedinUserStore: _loggedinUserStore_,
       state: $state,
       ionicHistory: $ionicHistory
     });
    }
   }));

  describe('methods', function () {
      it('should be able to logout', function () {
        var panelistSignupController = createController();

        spyOn(loggedinUserStore, 'clearDb');
        spyOn(state, 'go');
        spyOn(ionicHistory, 'nextViewOptions');

        scope.logout();

        expect(loggedinUserStore.clearDb).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalledWith('login');
        expect(ionicHistory.nextViewOptions).toHaveBeenCalledWith({disableBack : true, disableAnimate: true});
      });
    });
});
