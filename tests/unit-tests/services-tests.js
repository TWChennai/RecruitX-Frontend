describe('recruitFactory', function () {
  'use strict';

  var recruitFactory, httpBackend, cordovaToast, baseUrl;

  beforeEach(module('recruitX'));

  beforeEach(inject(function ($cordovaToast, $httpBackend, _apiUrl_, _recruitFactory_) {
    recruitFactory = _recruitFactory_;
    $httpBackend.whenGET(/templates.*/).respond(200, '');
    httpBackend = $httpBackend;
    cordovaToast = $cordovaToast;
    baseUrl = 'http://' + _apiUrl_;
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
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request.Please try again soon');
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
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request.Please try again soon');
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
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request.Please try again soon');
    });
  });

  describe('getCandidates', function () {
    it('getCandidates should return candidates when successful', function () {
      httpBackend.expectGET(baseUrl + '/candidates').respond('candidate1');
      recruitFactory.getCandidates(function (candidates) {
        expect(candidates).toEqual('candidate1');
      });

      httpBackend.flush();
    });

    it('getCandidates should display toast error message, call custom error handler when error and should not call the success method', function () {
      var customErrorHandler = jasmine.createSpy();
      httpBackend.expectGET(baseUrl + '/candidates').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.getCandidates(function (success) {
        expect(false).toEqual(success);
      }, customErrorHandler);

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request.Please try again soon');
      expect(customErrorHandler).toHaveBeenCalled();
    });
  });

  describe('saveCandidate', function () {
    it('saveCandidate should post data when successful', function () {
      httpBackend.expectPOST(baseUrl + '/candidates', 'data').respond('success');
      recruitFactory.saveCandidate('data', function (response) {
        expect(response).toEqual('success');
      });

      httpBackend.flush();
    });

    it('saveCandidate should display toast error message when error and should not call the success method', function () {
      httpBackend.expectPOST(baseUrl + '/candidates', 'data').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.saveCandidate('data', function (success) {
        expect(false).toEqual(success);
      });

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request.Please try again soon');
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
      httpBackend.expectPOST(baseUrl + '/panelists', 'data').respond(422, 'error');
      spyOn(cordovaToast, 'showShortBottom');

      recruitFactory.saveSignup('data', function (success) {
        expect(false).toEqual(success);
      });

      httpBackend.flush();
      expect(cordovaToast.showShortBottom).toHaveBeenCalledWith('Something went wrong while processing your request.Please try again soon');
    });
  });
});
