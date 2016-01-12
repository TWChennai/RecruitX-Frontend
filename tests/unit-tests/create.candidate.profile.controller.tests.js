describe('createCandidateProfileController', function () {
  'use strict';

  beforeEach(module('controllers'));

  var $controller, $scope = {}, controller;

  beforeEach(inject(function (_$controller_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    controller= $controller('createCandidateProfileController', { $scope: $scope });
  }));

  describe('validateForm', function () {
    it('should return true when no checkbox is checked', function () {
      expect($scope.validateForm()).toEqual(true);
    });

    it('should return true when any checkbox is checked, other than \'other\' checkbox and form is invalid', function () {
      $scope.candidateForm = {
        $invalid: true
      };
      $scope.candidate.java = true;
      expect($scope.validateForm()).toEqual(true);
    });

    it('should return false when checkbox is checked and form is valid', function () {
      $scope.candidateForm = {
        $invalid: false
      };
      $scope.candidate.other = true;
      expect($scope.validateForm()).toEqual(false);
    });
  });
});
