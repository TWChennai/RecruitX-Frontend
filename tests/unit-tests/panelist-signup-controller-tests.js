describe('panelistSignupController', function () {
  'use strict';

  beforeEach(module('recruitX'));
  var dialogService, scope, createController;

  beforeEach(inject(function ($controller, _loggedinUserStore_, _dialogService_, $rootScope) {
    spyOn(_loggedinUserStore_, 'userFirstName').and.returnValue('recruitx');
    spyOn(_loggedinUserStore_, 'isRecruiter').and.returnValue(true);
    scope = $rootScope.$new();
    dialogService = _dialogService_;
    createController = function () {
      $controller('panelistSignupController', {
        $scope: scope,
        loggedinUserStore: _loggedinUserStore_,
        dialogService: _dialogService_
      });
    };
  }));

  describe('methods', function () {
    it('should be able to logout', function () {
      var panelistSignupController = createController();
      spyOn(dialogService, 'askConfirmation');

      scope.logout();

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('Logout', 'Are you sure you want to logout?', jasmine.any(Function));
    });
  });
});
