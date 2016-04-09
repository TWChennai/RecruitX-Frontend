describe('interviewDetailsController', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var $scope = {}, loggedinUserStore;

  beforeEach(inject(function ($controller, _loggedinUserStore_, MasterData) {
    loggedinUserStore = _loggedinUserStore_;
    var interviewStatuses = [{
      name: 'Pass',
      id: 1
    }, {
      name: 'Pursue',
      id: 2
    }, {
      name: 'Strong Pursue',
      id: 3
    }];

    spyOn(loggedinUserStore, 'userId').and.returnValue('userId');
    spyOn(MasterData, 'getInterviewStatuses').and.returnValue(interviewStatuses);

    $controller('interviewDetailsController', {
      $scope: $scope
    });

    $scope.feedBackResult = undefined;
    $scope.feedbackImages = [
      {
        label: 'Areas of strength',
        URI: 'img/image_upload_icon.png',
        previewDisabled: true,
        isDownloaded: false
      },
      {
        label: 'Areas to improve',
        URI: 'img/image_upload_icon.png',
        previewDisabled: true,
        isDownloaded: false
      }
    ];
  }));

  describe('methods', function () {
    describe('extractFeedback', function () {
      var result = {
        id: 1,
        name: 'Pursue'
      };
      it('should extract the feed back result', function () {
        $scope.extractFeedback(result);
        expect(angular.equals($scope.feedBackResult.name, result.name)).toBe(true);
      });
    });

    describe('canNotEnterFeedBack', function () {
      var currentDate = {};
      var futureDate = {};
      var minutes = {};

      it('should return true if the interview start time is in the future and panelist is logged in user', function () {
        currentDate = new Date();
        minutes = 30;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + minutes));
        $scope.interview.start_time = futureDate;
        $scope.interview.panelists = ['userId'];

        expect($scope.canNotEnterFeedBack()).toEqual(true);
      });

      it('should return false if the interview start time is now and panelist is logged in user', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue('false');
        $scope.interview.start_time = new Date();
        $scope.interview.panelistsArray = ['userId'];

        expect($scope.canNotEnterFeedBack()).toEqual(false);
      });

      it('should return true if the interview start time is in the future and panelist is not logged in user', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue('false');
        currentDate = new Date();
        minutes = 30;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + minutes));
        $scope.interview.start_time = futureDate;
        $scope.interview.panelistsArray = ['test'];

        expect($scope.canNotEnterFeedBack()).toEqual(true);
      });

      it('should return false if the interview start time is in the past and panelist is logged in user and interview feedback is not available', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue('false');
        currentDate = new Date();
        minutes = 1;
        $scope.interview.start_time = new Date(currentDate.getYear(), currentDate.getMonth(), currentDate.getDay() - 1);
        $scope.interview.panelistsArray = ['userId'];

        expect($scope.canNotEnterFeedBack()).toEqual(false);
      });

      it('should return true if the interview start time is in the past and panelist is logged in user and interview feedback is available', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue('false');
        currentDate = new Date();
        minutes = 1;
        $scope.interview.start_time = new Date(currentDate.getYear(), currentDate.getMonth(), currentDate.getDay() - 1);
        $scope.interview.panelistsArray = ['userId'];
        $scope.interview.status = 'feedback';

        expect($scope.canNotEnterFeedBack()).toEqual(true);
      });

      it('should return true if the interview start time is in the past and panelist is not logged in user and feedback is available', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue('false');
        currentDate = new Date();
        minutes = 1;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() - minutes));
        $scope.interview.start_time = futureDate;
        $scope.interview.panelists = ['test'];
        $scope.interview.status = 'feedback';

        expect($scope.canNotEnterFeedBack()).toEqual(true);
      });

      it('should return true if the interview start time is in the past and panelist is not logged in user and feedback is not available and not recruiter', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue(false);
        currentDate = new Date();
        minutes = 1;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() - minutes));
        $scope.interview.start_time = futureDate;
        $scope.interview.panelists = ['test'];

        expect($scope.canNotEnterFeedBack()).toEqual(true);
      });

      it('should return false if the interview start time is in the past and logged in user is recruiter and feedback is not available', function () {
        spyOn(loggedinUserStore, 'isRecruiter').and.returnValue(true);
        currentDate = new Date();
        minutes = 1;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() - minutes));
        $scope.interview.start_time = futureDate;
        $scope.interview.panelists = ['test'];

        expect($scope.canNotEnterFeedBack()).toEqual(false);
      });
    });

    describe('canSubmit', function () {
      it('should return false when feedback result is not entered and feedback image is not uploaded', function () {
        expect($scope.canSubmit()).toEqual(false);
      });
      it('should return false when feedback result is not entered and feedback image is uploaded', function () {

        $scope.feedbackImages[0].previewDisabled = false;
        expect($scope.canSubmit()).toEqual(false);
      });
      it('should return false when feedback result is entered and feedback image is not uploaded', function () {
        $scope.feedBackResult = 'Pass';
        expect($scope.canSubmit()).toEqual(false);
      });
      it('should return true when feedback result is entered and feedback image is uploaded', function () {
        $scope.feedbackImages[0].previewDisabled = false;
        $scope.feedBackResult = 'Pass';

        expect($scope.canSubmit()).toEqual(true);
      });
    });
  });
});
