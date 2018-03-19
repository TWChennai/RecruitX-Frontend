describe('scheduleInterviewController', function() {
  'use strict';

  beforeEach(module('recruitX'));

  var $scope = {};
  var recruitFactory;

  beforeEach(inject(function($controller, $stateParams, MasterData, _loggedinUserStore_, _recruitFactory_) {
    $stateParams.candidate = {role_id: 1};
    $stateParams.candidate.interview_schedule = [];
    spyOn(_loggedinUserStore_, 'office').and.returnValue('chennai');
    spyOn(_recruitFactory_, 'saveCandidate');
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
    recruitFactory = _recruitFactory_;
    var roles = [{
      'skills': [{'id':1},{'id':2},{'id':3},{'id':4},{'id':5}],
      'name': 'Dev',
      'interview_types': [{'id':1},{'id':4},{'id':5},{'id':2},{'id':3}],
      'id':1
    }];

    spyOn(MasterData, 'getInterviewTypes').and.returnValue(interviewTypes);
    spyOn(MasterData, 'getRoles').and.returnValue(roles);

    $controller('scheduleInterviewController', {
      $scope: $scope
    });

    $scope.interviewRounds = interviewTypes;
  }));

  describe('screen validations', function() {
    describe('isFormValid', function() {
      it('should return false when atleast one interview has been scheduled', function() {
        $scope.interviewRounds[0].dateTime = new Date();
        expect($scope.isFormInvalid()).toEqual(false);
      });

      it('should return true when none of the interviews have been scheduled', function() {
        // $scope.interviewRounds[1].dateTime = new Date();
        expect($scope.isFormInvalid()).toEqual(true);
      });
    });

    describe('Check Office is being sent', function() {
      it('should send office name in the payload for saveCandidate', function() {
        $scope.postCandidate();
        expect(Object.keys(recruitFactory.saveCandidate.calls.mostRecent().args[0].candidate)).toContain('office');
      });

    });

    describe('checkWithPreviousRound', function() {
      it('should not return error when date selected is greater than previous priority interview schedule', function() {
        var previousInterviewRound = $scope.interviewRounds[0];
        previousInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual({});
      });

      it('should return error when date selected is less than previous priority interview schedule', function() {
        var previousInterviewRound = $scope.interviewRounds[1];
        previousInterviewRound.dateTime = new Date();
        var currentInterviewRound = $scope.interviewRounds[2];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual({
          message: 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name
        });
      });

      it('should NOT return error when date selected if previous priority interview is not scheduled and if previous is optional', function() {
        var previousInterviewRound = $scope.interviewRounds[1];
        previousInterviewRound.optional = true;
        var currentInterviewRound = $scope.interviewRounds[2];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithPreviousRound(scheduleDateTime, currentInterviewRound, previousInterviewRound)).toEqual({});
      });

      it('should return error when date is selected for a round before the previous round is scheduled if previous round is not optional', function() {
        var previousInterviewRound = $scope.interviewRounds[1];
        previousInterviewRound.optional = false;
        var currentInterviewRound = $scope.interviewRounds[2];

        expect($scope.checkWithPreviousRound(1453445460000, currentInterviewRound, previousInterviewRound)).toEqual({
          message: 'Please schedule this round atleast 1hr after  ' + previousInterviewRound.name
        });
      });

      it('should not return error while scheduling interview with least priority', function() {
        var currentInterviewRound = $scope.interviewRounds[0];

        expect($scope.checkWithPreviousRound(1453445460000, currentInterviewRound, undefined)).toEqual({});
      });

      it('should not return error if the current round is exactly one hour after previous round', function() {
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

    describe('getInterviewWithMinStartTime', function() {
      it('should return interview with least start time', function() {
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

    describe('checkWithNextRound', function() {
      it('should not return error when there are no interviews next', function() {
        var nextInterviewRounds = [];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should not return error when date selected is less than next priority interview schedule', function() {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should return error when date selected is greater than than next priority interview schedule', function() {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        nextInterviewRound.optional = false;
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({
          message: 'Please schedule this round atleast 1hr before  ' + nextInterviewRound.name
        });
      });

      it('should return error when date selected is greater than than next priority optional interview schedule', function() {
        var nextInterviewRound = $scope.interviewRounds[2];
        nextInterviewRound.dateTime = new Date();
        nextInterviewRound.optional = true;
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();
        var minutes = 20;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({
          message: 'Please schedule this round atleast 1hr before  ' + nextInterviewRound.name
        });
      });

      it('should not return error when next interview is not scheduled', function() {
        var nextInterviewRound = $scope.interviewRounds[2];
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[1];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should not return error when scheduling the highest priority interview', function() {
        var nextInterviewRound = $scope.interviewRounds[4];
        var nextInterviewRounds = [nextInterviewRound];
        var currentInterviewRound = $scope.interviewRounds[3];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({});
      });

      it('should use the next interview with lowest start time for comparison if next n interviews are of same priority', function() {
        var nextInterviewRound1 = $scope.interviewRounds[3];
        nextInterviewRound1.dateTime = new Date();
        var nextInterviewRound2 = $scope.interviewRounds[4];
        var pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 10);
        nextInterviewRound2.dateTime = pastDate;
        var nextInterviewRounds = [nextInterviewRound1, nextInterviewRound2];
        var currentInterviewRound = $scope.interviewRounds[2];
        var scheduleDateTime = new Date();

        expect($scope.checkWithNextRound(scheduleDateTime, currentInterviewRound, nextInterviewRounds)).toEqual({
          message: 'Please schedule this round atleast 1hr before  ' + nextInterviewRound2.name
        });
      });

      it('should not return error if the current round is exactly one hour before next round', function() {
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

    describe('checkWithRoundOfSamePriority', function() {
      it('should not return error when there are no interviews next', function() {
        var otherRoundsWithSamePriority = [];
        var currentInterviewRound = $scope.interviewRounds[3];
        var scheduleDateTime = new Date();

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({});
      });

      it('should not return error when date selected is less than same priority interview schedule', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({});
      });

      it('should not return error when date selected is greater than same priority interview schedule', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({});
      });

      it('should not return error when date selected is greater than same priority interview schedule', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 61;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({});
      });

      it('should not return error when date selected is exactly one hour greater than same priority interview schedule', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 60;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({});
      });

      it('should not return error when date selected is exactly one hour lesser than same priority interview schedule', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 60;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({});
      });

      it('should return error when selected date is less than same priority interview schedule by one hour', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 59;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() - minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({
          message: 'Please schedule this round atleast 1hr before/after ' + otherRoundWithSamePriority.name});
      });

      it('should return error when date selected is greater than same priority interview schedule by less than one hour', function() {
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = new Date();
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = new Date();
        var minutes = 59;

        scheduleDateTime.setMinutes(scheduleDateTime.getMinutes() + minutes);

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({
          message: 'Please schedule this round atleast 1hr before/after ' + otherRoundWithSamePriority.name});
      });

      it('should return error when date selected is equal to same priority interview schedule', function() {
        var now = new Date();
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = now;
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = now;

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({
          message: 'Please schedule this round atleast 1hr before/after ' + otherRoundWithSamePriority.name});
      });

      it('should return error when date selected is clashes to same priority interview schedule that is optional', function() {
        var now = new Date();
        var otherRoundWithSamePriority = $scope.interviewRounds[3];
        otherRoundWithSamePriority.dateTime = now;
        otherRoundWithSamePriority.optional = true;
        var otherRoundsWithSamePriority = [otherRoundWithSamePriority];
        var currentInterviewRound = $scope.interviewRounds[4];
        var scheduleDateTime = now;

        expect($scope.checkWithRoundOfSamePriority(scheduleDateTime, currentInterviewRound, otherRoundsWithSamePriority)).toEqual({
          message: 'Please schedule this round atleast 1hr before/after ' + otherRoundWithSamePriority.name});
      });
    });

    describe('isCancelable', function() {
      it('should return false if start time for current interview is undefined', function() {
        var currentInterview = $scope.interviewRounds[0];

        expect($scope.isCancelable(currentInterview)).toEqual(false);
      });

      it('should return false if next interview is scheduled already', function() {
        var currentInterview = $scope.interviewRounds[1];
        $scope.interviewRounds[0].dateTime = $scope.interviewRounds[2].dateTime = currentInterview.dateTime = 'date time';

        expect($scope.isCancelable(currentInterview)).toEqual(false);
      });

      it('should return false if one of the next interviews is scheduled already', function() {
        var currentInterview = $scope.interviewRounds[2];
        $scope.interviewRounds[0].dateTime = $scope.interviewRounds[1].dateTime = currentInterview.dateTime = $scope.interviewRounds[4].dateTime = 'date time';

        expect($scope.isCancelable(currentInterview)).toEqual(false);
      });

      it('should return true if none of the next interviews are scheduled', function() {
        var currentInterview = $scope.interviewRounds[2];
        $scope.interviewRounds[0].dateTime = $scope.interviewRounds[1].dateTime = currentInterview.dateTime = 'date time';

        expect($scope.isCancelable(currentInterview)).toEqual(true);
      });
    });
  });
});
