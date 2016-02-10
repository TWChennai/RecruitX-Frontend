describe('loginController', function() {

  beforeEach(module('recruitX'));

  describe('let users log in', function() {

    var createController, scope, oktaWidget, userStore, validUser, state, history, recruitFactory;
    beforeEach(inject(function($controller, $rootScope) {
        validUser = {
          'id':'1241kjhhlkj634345',
          'profile':{
            'login':'recruitx@thoughtworks.com',
            'firstName':'recruit',
            'lastName':'user'
          }
        };

        scope = $rootScope.$new();
        userStore = { storeUser : function () {}};
        oktaWidget = { renderEl : function() {}};
        history = {nextViewOptions : function(){}};
        mockRecruitFactory = {isRecruiter : function(){}};
        state = { go : function() {}};
        createController = function() {
          return $controller('loginController', {$scope : scope, oktaSigninWidget : oktaWidget, loggedinUserStore : userStore, $state : state, $ionicHistory : history, recruitFactory : mockRecruitFactory});
        };
      }));

    it('should store a user and navigate to the list when a user is authorised', function() {
        recruiter = { is_recruiter : true };

        oktaWidget.renderEl = function(targetElementConfig, responseCallback) {
          expect(targetElementConfig.el).toEqual('#okta-login-container');
          responseCallback({status : 'SUCCESS', user: validUser});
        };

        mockRecruitFactory.isRecruiter = function(userId, responseCallback) {
          expect(userId).toEqual('recruitx');
          responseCallback(recruiter);
        };

        spyOn(userStore, 'storeUser');
        spyOn(oktaWidget, 'renderEl').and.callThrough();
        spyOn(mockRecruitFactory, 'isRecruiter').and.callThrough();
        spyOn(state, 'go');
        spyOn(history, 'nextViewOptions');

        var loginController = createController();

        expect(oktaWidget.renderEl).toHaveBeenCalled();
        expect(userStore.storeUser).toHaveBeenCalledWith(validUser, recruiter.is_recruiter);
        expect(state.go).toHaveBeenCalledWith('panelist-signup');
        expect(history.nextViewOptions).toHaveBeenCalledWith({disableBack : recruiter.is_recruiter});
      });

    it('should not do that if login is unsuccessful', function() {
        oktaWidget.renderEl = function(targetElementConfig, responseCallback) {
           expect(targetElementConfig.el).toEqual('#okta-login-container');
           responseCallback({status : 'FAIL', user: validUser});
         };

        spyOn(userStore, 'storeUser');
        spyOn(oktaWidget, 'renderEl').and.callThrough();
        spyOn(state, 'go');
        spyOn(history, 'nextViewOptions');

        var loginController = createController();

        expect(oktaWidget.renderEl).toHaveBeenCalled();
        expect(userStore.storeUser).not.toHaveBeenCalled();
        expect(state.go).not.toHaveBeenCalled();
        expect(history.nextViewOptions).not.toHaveBeenCalled();
      });
  });
});
