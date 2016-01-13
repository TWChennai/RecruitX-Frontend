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
        describe('isAtleastOnePredefinedSkillSelected', function(){
          it('should return true when candidate has predetermined skills',function(){
              $scope.candidate.skills[0].checked = true;
              expect($scope.isAtleastOnePredefinedSkillSelected()).toEqual(true);
          });

          it('should return false when candidate has no skills',function(){
              expect($scope.isAtleastOnePredefinedSkillSelected()).toEqual(false);
          });

          it('should return false when candidate has other skills but not predefined skills',function(){
              $scope.getOtherCheckbox().checked = true;
              $scope.getOtherCheckbox().detail = "Ionic";
              expect($scope.isAtleastOnePredefinedSkillSelected()).toEqual(false);
          });
        });

        describe('getOtherCheckbox',function(){
          it('should return other checkbox',function(){
            expect($scope.getOtherCheckbox().name).toEqual("Other");
          });
        });

        describe('isSkillFieldsValid',function(){
          it('should return true when candidate has a predefined skill', function(){
            $scope.candidate.skills[0].checked = true;
            expect($scope.isSkillFieldsValid()).toEqual(true);
          });

          it('should return true when candidate has other skill but no predefined skill', function(){
            $scope.getOtherCheckbox().checked = true;
            $scope.getOtherCheckbox().detail = "Ionic";
            expect($scope.isSkillFieldsValid()).toEqual(true);
          });

          it('should return false when candidate has other skill unchecked but detail is entered', function(){
            $scope.getOtherCheckbox().checked = false;
            $scope.getOtherCheckbox().detail = "Ionic";
            expect($scope.isSkillFieldsValid()).toEqual(false);
          });

          it('should return false when candidate has other skill checked but no detail is entered', function(){
            $scope.getOtherCheckbox().checked = true;
            expect($scope.isSkillFieldsValid()).toEqual(false);
          });

          it('should return true when candidate has other skill and predefined skill', function(){
            $scope.getOtherCheckbox().checked = true;
            $scope.getOtherCheckbox().detail = "Ionic";
            $scope.candidate.skills[0].checked = true;

            expect($scope.isSkillFieldsValid()).toEqual(true);
          });

          it('should return false when candidate has no predefined or other skills', function(){
              expect($scope.isSkillFieldsValid()).toEqual(false);
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
