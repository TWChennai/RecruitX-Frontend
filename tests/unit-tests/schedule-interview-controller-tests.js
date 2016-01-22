describe('scheduleInterviewController', function() {
  'use strict';

beforeEach(module('starter'));

var $controller, $scope = {}, controller;



beforeEach(inject(function(_$controller_, $stateParams) {
  // The injector unwraps the underscores (_) from around the parameter names when matching

  $stateParams = $stateParams;
  $stateParams.candidate = {};
  $stateParams.candidate.interview_schedule = [];
  $controller = _$controller_;
  controller = $controller('scheduleInterviewController', { $scope: $scope });

  $scope.interviewRounds = [{id: 1, name: 'Code Pairing', priority: 1}, {id: 2, name: 'Technical1', priority: 2}, {id: 3, name: 'Technical2', priority: 3}, {id: 4, name: 'Leadership', priority: 4}, {id: 1, name: 'P3', priority: 4}];
}));

describe('screen validations', function() {
  describe('isFormValid', function() {
    it('should return false when atleast one interview has been scheduled', function(){
      $scope.interviewRounds[0].dateTime = new Date();
      expect($scope.isFormInvalid()).toEqual(false);
    });
    it('should return true when none of the interviews have been scheduled', function(){
      // $scope.interviewRounds[1].dateTime = new Date();
      expect($scope.isFormInvalid()).toEqual(true);
    });
  });

    describe('isInterviewScheduleValid', function(){
      it('should return true when date selected is greater than previous priority interview schedule', function(){

        var previousInterviewRound = $scope.interviewRounds[0];
        previousInterviewRound.dateTime = 1453445460000;
        var currentInterviewRound = $scope.interviewRounds[1];

        expect($scope.isInterviewScheduleValid(1453449120000, currentInterviewRound, previousInterviewRound)).toEqual(true);

      });
      it('should return false when date selected is not greater than previous priority interview schedule', function(){

        var previousInterviewRound = $scope.interviewRounds[1];
        previousInterviewRound.dateTime = 1453445460000;
        var currentInterviewRound = $scope.interviewRounds[2];

        expect($scope.isInterviewScheduleValid(1453445460000, currentInterviewRound, previousInterviewRound)).toEqual(false);

      });
      it('should return false when date is selected for a round before the previous round is scheduled', function(){

        var previousInterviewRound = $scope.interviewRounds[1];
        var currentInterviewRound = $scope.interviewRounds[2];

        expect($scope.isInterviewScheduleValid(1453445460000, currentInterviewRound, previousInterviewRound)).toEqual(false);

      });

  });
});
});
