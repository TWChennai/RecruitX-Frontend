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
      it('should not return error when date selected is greater than previous priority interview schedule', function () {
        var previousInterviewRound = $scope.interviewRounds[0];
        previousInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual({});
      });

      it('should return error when date selected is less than previous priority interview schedule', function () {
        var previousInterviewRound = $scope.interviewRounds[1];
        previousInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[2];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual({message: 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name});
      });

      it('should return error when date is selected for a round before the previous round is scheduled', function () {
        var previousInterviewRound = $scope.interviewRounds[1];
        var currentInterviewRound = $scope.interviewRounds[2];

        expect($scope.checkWithPreviousRound(1453445460000, currentInterviewRound, previousInterviewRound)).toEqual({message: 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name});
      });

      it('should not return error while scheduling interview with least priority', function () {
        var currentInterviewRound = $scope.interviewRounds[0];

        expect($scope.checkWithPreviousRound(1453445460000, currentInterviewRound, undefined)).toEqual({});
      });

      it('should not return error if the current round is exactly one hour after previous round', function () {
        var previousInterviewRound = $scope.interviewRounds[1];
        var date = new Date();
        previousInterviewRound.dateTime = date;
        var currentInterviewRound = $scope.interviewRounds[2];
        var futureDate = new Date(date.getTime());
        futureDate.setHours(futureDate.getHours() + 1);
        var scheduleDateTime = futureDate;

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual({});
      });
    });

    describe('getInterviewWithMinStartTime', function () {
      it('should return interview with least start time', function () {
        var interview1 = $scope.interviewRounds[0];
        interview1.dateTime = new Date();
        var interview2 = $scope.interviewRounds[1];
        var pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 2);
        interview2.dateTime = pastDate;
        var interview3 = $scope.interviewRounds[3];
        var futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        interview3.dateTime = futureDate;
        var interviews = [interview1, interview2, interview3];

        expect($scope.getInterviewWithMinStartTime(interviews)).toEqual(interview2);
      });
    });

    describe('checkWithNextRound', function () {
      it('should not return error when there are no interviews next', function () {
        var nextInterviewRounds = [];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should not return error when date selected is less than next priority interview schedule', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should return error when date selected is greater than than next priority interview schedule', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({message: 'Please schedule this round atleast 1hr before  ' + nextInterviewRound.name});
      });

      it('should not return error when next interview is not scheduled', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should not return error when scheduling the highest priority interview', function () {
        var nextInterviewRound = $scope.interviewRounds[4];
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[3];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should use the next interview with lowest start time for comparison if next n interviews are of same priority', function () {
        var nextInterviewRound1 = $scope.interviewRounds[3];
        nextInterviewRound1.dateTime = new Date();
        var nextInterviewRound2 = $scope.interviewRounds[4];
        var pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 10);
        nextInterviewRound2.dateTime = pastDate;
        var nextInterviewRounds = [nextInterviewRound1, nextInterviewRound2];
        var currentInterviewRound = $scope.interviewRounds[2];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({message: 'Please schedule this round atleast 1hr before  ' + nextInterviewRound2.name});
      });

      it('should not return error if the current round is exactly one hour before next round', function () {
        var nextInterviewRound = $scope.interviewRounds[2];
        var date = new Date();
        nextInterviewRound.dateTime = date;
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var pastDate = new Date(date.getTime());
        pastDate.setHours(pastDate.getHours() - 1);
        var scheduleDateTime = pastDate;

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });
    });
  });
});
