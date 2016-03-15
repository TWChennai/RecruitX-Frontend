describe('recruitFactory', function () {
  'use strict';

  var recruitFactory, httpBackend, cordovaToast, baseUrl;

  beforeEach(module('recruitX'));

  beforeEach(inject(function ($cordovaToast, $httpBackend, apiUrl, _recruitFactory_, loggedinUserStore) {
    recruitFactory = _recruitFactory_;
    spyOn(loggedinUserStore, 'userId').and.returnValue('userId');
    $httpBackend.whenGET(/templates.*/).respond(200, '');
    httpBackend = $httpBackend;
    cordovaToast = $cordovaToast;
    baseUrl = apiUrl;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getRoles', function () {
    it('getRoles should return roles when successful', function () {
      httpBackend.expectGET(baseUrl + '/roles').respond(['dev', 'qa']);
      recruitFactory.getRoles(function (roles) {
        expect(roles).toEqual(['dev', 'qa']);
      });
      httpBackend.flush();
    });

    it('getRoles should display toast error message when error and should not call the success method', function () {
      httpBackend.expectGET(baseUrl + '/roles').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.getRoles(function (success) {
        expect(false).toEqual(success);
      });
      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
    });
  });

  describe('getRoleBasedSkills', function () {
    it('getRoleBasedSkills should return role based skill IDs when successful', function () {
      var roleBasedSkills = [{
        'skill_id': 1,
        'role_id': 1
      }, {
        'skill_id': 2,
        'role_id': 1
      }, {
        'skill_id': 3,
        'role_id': 2
      }];
      httpBackend.expectGET(baseUrl + '/role_skills').respond(roleBasedSkills);
      recruitFactory.getRoleBasedSkills(function (roles) {
        expect(roles).toEqual(roleBasedSkills);
      });
      httpBackend.flush();
    });

    it('getRoles should display toast error message when error and should not call the success method', function () {
      httpBackend.expectGET(baseUrl + '/role_skills').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.getRoleBasedSkills(function (success) {
        expect(false).toEqual(success);
      });
      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
    });
  });

  describe('getPipelineStatuses', function () {
    it('getPipelineStatuses should return pipeline statuses when successful', function () {
      httpBackend.expectGET(baseUrl + '/pipeline_statuses').respond(['In Progress', 'Closed']);
      recruitFactory.getPipelineStatuses(function (pipelineStatuses) {
        expect(pipelineStatuses).toEqual(['In Progress', 'Closed']);
      });
      httpBackend.flush();
    });

    it('getRoles should display toast error message when error and should not call the success method', function () {
      httpBackend.expectGET(baseUrl + '/pipeline_statuses').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.getPipelineStatuses(function (success) {
        expect(false).toEqual(success);
      });
      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
    });
  });

  describe('getSkills', function () {
    it('getSkills should return skills when successful', function () {
      httpBackend.expectGET(baseUrl + '/skills').respond(['java', 'ruby']);
      recruitFactory.getSkills(function (skills) {
        expect(skills).toEqual(['java', 'ruby']);
      });

      httpBackend.flush();
    });

    it('getSkills should display toast error message when error and should not call the success method', function () {
      httpBackend.expectGET(baseUrl + '/skills').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.getSkills(function (success) {
        expect(false).toEqual(success);
      });

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
    });
  });

  describe('getInterviewTypes', function () {
    it('getInterviewTypes should return interviews when successful', function () {
      httpBackend.expectGET(baseUrl + '/interview_types').respond(['round1', 'round2']);
      recruitFactory.getInterviewTypes(function (interviews) {
        expect(interviews).toEqual(['round1', 'round2']);
      });

      httpBackend.flush();
    });

    it('getSkills should display toast error message when error and should not call the success method', function () {
      httpBackend.expectGET(baseUrl + '/interview_types').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.getInterviewTypes(function (success) {
        expect(false).toEqual(success);
      });

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
    });
  });

  describe('saveCandidate', function () {
    it('saveCandidate should post data when successful', function () {
      httpBackend.expectPOST(baseUrl + '/candidates', 'data').respond('success');
      recruitFactory.saveCandidate('data', function (response) {
        expect(response.data).toEqual('success');
      });

      httpBackend.flush();
    });

    it('saveCandidate on error should not call the success method', function () {
      httpBackend.expectPOST(baseUrl + '/candidates', 'data').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.saveCandidate('data', function (response) {
        expect(false).toEqual(response);
      }, function (response) {
        expect(response.data).toEqual('error');
      });

      httpBackend.flush();
    });
  });

  describe('closePipeline', function () {
    it('closePipeline should post data when successful', function () {
      httpBackend.expectPUT(baseUrl + '/candidates/id', 'data').respond('success');
      recruitFactory.closePipeline('data', 'id', function (response) {
        expect(response.data).toEqual('success');
      });

      httpBackend.flush();
    });

    it('closePipeline should display alert when error and should not call the success method', function () {
      httpBackend.expectPUT(baseUrl + '/candidates/id', 'data').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.closePipeline('data', 'id', function (success) {
        expect(false).toEqual(success);
      }, function () {
        expect(true).toEqual(true);
      });

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).not.toHaveBeenCalled();
    });
  });

  describe('signUp', function () {
    it('signup should post data when successful', function () {
      httpBackend.expectPOST(baseUrl + '/panelists').respond('success');
      recruitFactory.signUp('data', function (response) {
        expect(response).toEqual('success');
      });

      httpBackend.flush();
    });

    it('signup should display toast error message when error and should not call the success method', function () {
      var errorStatus = 400;
      httpBackend.expectPOST(baseUrl + '/panelists', 'data').respond(errorStatus, 'error');
      spyOn(cordovaToast, 'showShortBottom');
      var unProcessableEntityErrorHandler = jasmine.createSpy('unProcessableEntityErrorHandler');
      var customErrorHandler = jasmine.createSpy('customErrorHandler');

      recruitFactory.signUp('data', function (success) {
        expect(false).toEqual(success);
      }, unProcessableEntityErrorHandler, customErrorHandler);

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
      expect(customErrorHandler).toHaveBeenCalled();
      expect(unProcessableEntityErrorHandler).not.toHaveBeenCalled();
    });

    it('signup should not display toast error message when 422 and should not call the success method', function () {
      var unProcessableEntityStatus = 422;
      httpBackend.expectPOST(baseUrl + '/panelists', 'data').respond(unProcessableEntityStatus, 'error');
      spyOn(cordovaToast, 'showShortBottom');
      var unProcessableEntityErrorHandler = jasmine.createSpy('unProcessableEntityErrorHandler');
      var customErrorHandler = jasmine.createSpy('customErrorHandler');

      recruitFactory.signUp('data', function (success) {
        expect(false).toEqual(success);
      }, unProcessableEntityErrorHandler, customErrorHandler);

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).not.toHaveBeenCalled();
      expect(unProcessableEntityErrorHandler).toHaveBeenCalled();
      expect(customErrorHandler).not.toHaveBeenCalled();
    });
  });

  describe('delete interview panelist', function () {
    var id = 1;
    it('should delete data when successful', function () {
      httpBackend.expectDELETE(baseUrl + '/panelists/' + id).respond('success');
      recruitFactory.deleteInterviewPanelist(id, function (response) {
        expect(response).toEqual('success');
      });

      httpBackend.flush();
    });

    it('should display toast error message when error and should not call the success method', function () {
      var errorStatus = 400;
      httpBackend.expectDELETE(baseUrl + '/panelists/' + id).respond(errorStatus, 'error');
      spyOn(cordovaToast, 'showShortBottom');
      var unProcessableEntityErrorHandler = jasmine.createSpy('unProcessableEntityErrorHandler');
      var customErrorHandler = jasmine.createSpy('customErrorHandler');

      recruitFactory.deleteInterviewPanelist(id, function (success) {
        expect(false).toEqual(success);
      }, unProcessableEntityErrorHandler, customErrorHandler);

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request. Please try again soon.');
      expect(customErrorHandler).toHaveBeenCalled();
      expect(unProcessableEntityErrorHandler).not.toHaveBeenCalled();
    });

    it('should not display toast error message when 422 and should not call the success method', function () {
      var unProcessableEntityStatus = 422;
      httpBackend.expectDELETE(baseUrl + '/panelists/' + id).respond(unProcessableEntityStatus, 'error');
      spyOn(cordovaToast, 'showShortBottom');
      var unProcessableEntityErrorHandler = jasmine.createSpy('unProcessableEntityErrorHandler');
      var customErrorHandler = jasmine.createSpy('customErrorHandler');

      recruitFactory.deleteInterviewPanelist(id, function (success) {
        expect(false).toEqual(success);
      }, unProcessableEntityErrorHandler, customErrorHandler);

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).not.toHaveBeenCalled();
      expect(unProcessableEntityErrorHandler).toHaveBeenCalled();
      expect(customErrorHandler).not.toHaveBeenCalled();
    });
  });
});
