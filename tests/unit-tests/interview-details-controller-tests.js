describe('interviewDetailsController', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var $scope = {};

  beforeEach(inject(function ($controller) {
    $controller('interviewDetailsController', {
      $scope: $scope
    });
  }));

  describe('methods', function () {
    describe('extractFeedback', function () {
      $scope.feedBackResult = {};
      var result = 'Pursue';
      it('should extract the feed back result', function () {
        $scope.extractFeedback(result);
        expect(angular.equals($scope.feedBackResult, result)).toBe(true);
      });
    });

    describe('canNotEnterFeedBack', function () {
      var currentDate = {};
      var futureDate = {};
      var minutes = {};

      it('should return true if the interview start time is in the future', function () {
        // $scope.interview.start_time = '2016-02-05T09:17:00Z';
        currentDate = new Date();
        minutes = 30;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + minutes));
        $scope.interview.start_time = futureDate;

        expect($scope.canNotEnterFeedBack()).toEqual(true);
      });

      it('should return false if the interview start time is in the past', function () {
        currentDate = new Date();
        minutes = 1;
        futureDate = new Date(currentDate.setMinutes(currentDate.getMinutes() - minutes));
        $scope.interview.start_time = futureDate;

        expect($scope.canNotEnterFeedBack()).toEqual(false);
      });

      it('should return false if the interview start time is now', function () {
        $scope.interview.start_time = currentDate;

        expect($scope.canNotEnterFeedBack()).toEqual(false);
      });
    });
  });
});
