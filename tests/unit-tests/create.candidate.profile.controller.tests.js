describe('createCandidateProfileController', function () {
  'use strict';

  beforeEach(module('starter'));

  var $controller, $scope = {}, controller;

  beforeEach(inject(function (_$controller_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    controller= $controller('createCandidateProfileController', { $scope: $scope });
  }));

  describe ('methods', function(){
        describe('hasOtherSkills', function(){
          it('should return false when candidate has no other skills',function(){
              expect($scope.hasOtherSkills()).toEqual(false);
          });

          it('should return true when candidate has other skills',function(){
              $scope.candidate.skills[$scope.candidate.skills.length - 1].checked = true;
              expect($scope.hasOtherSkills()).toEqual(true);
          });
        });

        describe('isAtleastOneSkillSelected', function(){
          it('should return false when candidate has no other skills',function(){
              expect($scope.isAtleastOneSkillSelected()).toEqual(false);
          });

          it('should return true when candidate has  skills',function(){
              $scope.candidate.skills[0].checked = true;
              expect($scope.isAtleastOneSkillSelected()).toEqual(true);
          });
        });
  });

  describe('form validations', function () {

    it('should return valid when checkbox is checked and form is valid', function () {
      $scope.candidateForm = {
        $invalid: false
      };
      $scope.candidate.skills[0].checked = true;
      expect($scope.isFormInvalid()).toEqual(false);
    });

    it('should be invalid when no skill checkbox is checked and rest of the fields are valid', function () {
      $scope.candidateForm = {
         $invalid: false
       };
      expect($scope.isFormInvalid()).toEqual(true);
    });

    it('should return invalid when any skill checkbox is checked and form is invalid', function () {
      $scope.candidateForm = {
        $invalid: true
      };
      $scope.candidate.skills[0].checked = true;
      expect($scope.isFormInvalid()).toEqual(true);
    });
  });
});
