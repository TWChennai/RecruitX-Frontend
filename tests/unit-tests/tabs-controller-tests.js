describe('TabsCtrl', function () {
  'use strict';

  beforeEach(module('recruitX'));
  var dialogService, $scope, recruitFactory, cordovaToast;

  beforeEach(inject(function ($controller, _loggedinUserStore_, _dialogService_, $rootScope, _recruitFactory_, $cordovaToast) {
    var experience = 1.23;
    spyOn(_loggedinUserStore_, 'userFirstName').and.returnValue('recruitx');
    spyOn(_loggedinUserStore_, 'userId').and.returnValue('recruitx');
    spyOn(_loggedinUserStore_, 'isRecruiter').and.returnValue(true);
    spyOn(_loggedinUserStore_, 'isSuperUser').and.returnValue(false);
    spyOn(_loggedinUserStore_, 'pastExperience').and.returnValue(experience);
    spyOn(_loggedinUserStore_, 'calculatedHireDate').and.returnValue('2015-11-11');
    spyOn(_loggedinUserStore_, 'role').and.returnValue({name: 'Dev'});
    spyOn(_loggedinUserStore_, 'isSignupCop').and.returnValue(false);
    spyOn(_loggedinUserStore_, 'office').and.returnValue("chennai");
    spyOn(_recruitFactory_, 'deleteInterviewPanelist');
    spyOn(_recruitFactory_, 'signUp');
    spyOn(_recruitFactory_, 'sendSos');
    spyOn(_recruitFactory_, 'getSosStatus');
    $scope = $rootScope.$new();
    dialogService = _dialogService_;
    recruitFactory = _recruitFactory_;
    cordovaToast = $cordovaToast;
    $controller('TabsCtrl', {
      $scope: $scope,
      loggedinUserStore: _loggedinUserStore_,
      dialogService: _dialogService_,
      recruitFactory: _recruitFactory_
    });
  }));

  describe('methods', function () {
    it('should be able to logout', function () {
      spyOn(dialogService, 'askConfirmation');

      $scope.logout();

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('Logout', 'Are you sure you want to logout?', jasmine.any(Function));
    });

    it('decliningInterview should ask confirmation', function(){
      spyOn(dialogService, 'askConfirmation');
      var event = jasmine.createSpyObj('$event', ['stopPropagation']);
      var myinterview = {
        panelists: [{
          name: 'recruitx',
          interview_panelist_id: 1
        }],
        candidate: {
          id: 1
        }
      };

      $scope.decliningInterview(event, myinterview);

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('Decline', 'Are you sure you want to decline this interview?', $scope.declineInterview);
    });

    it('decliningSlot should ask confirmation', function(){
      spyOn(dialogService, 'askConfirmation');
      var event = jasmine.createSpyObj('$event', ['stopPropagation']);
      var myinterview = {
        panelists: [{
          name: 'recruitx',
          interview_panelist_id: 1
        }],
        candidate: {
          id: undefined
        }
      };

      $scope.decliningInterview(event, myinterview);

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('Decline', 'Are you sure you want to decline this slot?', $scope.declineSlot);
    });

    it('declineInterview should call deleteInterviewPanelist', function(){
      $scope.declineInterview();

      expect(recruitFactory.deleteInterviewPanelist).toHaveBeenCalled();
    });

    it('signUp should call signUp in recruitFactory', function(){
      $scope.signUp();

      expect(recruitFactory.signUp).toHaveBeenCalled();
    });

    it('signingUp should show a toast with the reason if interview is not eligible for signup',function(){
      spyOn(cordovaToast, 'showShortBottom');
      var event = jasmine.createSpyObj('$event', ['stopPropagation']);
      var interview = {
        signup: false,
        signup_error: 'More than 2 signups not allowed'
      };

      $scope.signingUp(event, interview);

      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('More than 2 signups not allowed');
    });

    it('signingUp should ask confirmation if interview is eligible for signup', function(){
      spyOn(dialogService, 'askConfirmation');
      var event = jasmine.createSpyObj('$event', ['stopPropagation']);
      var interview = {
        id: 1,
        signup: true,
        candidate: {
          id: 1
        }
      };

      $scope.signingUp(event, interview);

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('Sign up', 'Are you sure you want to sign up for this interview?', jasmine.any(Function));
    });

    it('signingUp should ask confirmation if slot is eligible for signup', function(){
      spyOn(dialogService, 'askConfirmation');
      var event = jasmine.createSpyObj('$event', ['stopPropagation']);
      var interview = {
        id: 1,
        signup: true,
        candidate: {
          id: undefined
        }
      };

      $scope.signingUp(event, interview);

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('Sign up', 'Are you sure you want to sign up for this slot?', jasmine.any(Function));
    });

    it('sosEmail button should ask confirmation before sending email', function(){
      spyOn(dialogService, 'askConfirmation');
      $scope.sendSos();

      expect(dialogService.askConfirmation).toHaveBeenCalledWith('SOS', 'Are you sure you want to send SOS Email?', jasmine.any(Function));
    });

    it('triggerSos should make a http call to sendSos', function(){
      $scope.triggerSos();

      expect(recruitFactory.sendSos).toHaveBeenCalled();
    });

    it('getSosStatus should make http request', function(){
      $scope.getSosStatus();

      expect(recruitFactory.getSosStatus).toHaveBeenCalled();
    });

    describe('isInFuture', function() {
      it('should return false if date is in past', function(){
        var now = new Date();
        var past = new Date(now.setHours(now.getHours() - 1));

        expect($scope.isInFuture(past)).toEqual(false);
      });

      it('should return true if date is in future', function(){
        var now = new Date();
        var future = new Date(now.setHours(now.getHours() + 1));

        expect($scope.isInFuture(future)).toEqual(true);
      });
    });
  });
});
