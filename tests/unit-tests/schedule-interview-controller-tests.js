describe('scheduleInterviewController', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var $scope = {};

  beforeEach(inject(function ($controller, $stateParams, MasterData) {
    $stateParams.candidate = {};
    $stateParams.candidate.interview_schedule = [];

    var interviewTypes = [{
      id: 1,
      name: 'Code Pairing',
      priority: 1
    }, {
      id: 2,
      name: 'Technical1',
      priority: 2
    }, {
      id: 3,
      name: 'Technical2',
      priority: 3
    }, {
      id: 4,
      name: 'Leadership',
      priority: 4
    }, {
      id: 5,
      name: 'P3',
      priority: 4
    }];

    spyOn(MasterData, 'getInterviewTypes').and.returnValue(interviewTypes);

    $controller('scheduleInterviewController', {
      $scope: $scope
    });

    $scope.interviewRounds = interviewTypes;
  }));

  describe('screen validations', function () {
    describe('isFormValid', function () {
      it('should return false when atleast one interview has been scheduled', function () {
        $scope.interviewRounds[0].dateTime = new Date();
        expect($scope.isFormInvalid()).toEqual(false);
      });

      it('should return true when none of the interviews have been scheduled', function () {
        // $scope.interviewRounds[1].dateTime = new Date();
        expect($scope.isFormInvalid()).toEqual(true);
      });
    });

    describe('checkWithPreviousRound', function () {
      it('should return true when date selected is greater than previous priority interview schedule', function () {
        var previousInterviewRound = $scope.interviewRounds[0];
        previousInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual(true);
      });

      it('should return false when date selected is not greater than previous priority interview schedule', function () {
        var previousInterviewRound = $scope.interviewRounds[1];
        previousInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[2];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual(false);
      });

      it('should return false when date is selected for a round before the previous round is scheduled', function () {
        var previousInterviewRound = $scope.interviewRounds[1];
        var currentInterviewRound = $scope.interviewRounds[2];

        expect($scope.checkWithPreviousRound(1453445460000, currentInterviewRound, previousInterviewRound)).toEqual(false);
      });
    });

    describe('checkWithNextRound', function () {
      it('should return true when date selected is less than next priority interview schedule', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRound)).toEqual(true);
      });

      it('should return false when date selected is greater than than next priority interview schedule', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRound)).toEqual(false);
      });

      it('should return true when next interview is not scheduled', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRound)).toEqual(true);
      });
    });
  });
});
