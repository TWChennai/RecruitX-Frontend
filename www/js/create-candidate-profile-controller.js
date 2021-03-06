angular.module('recruitX')
  .controller('createCandidateProfileController', ['$rootScope', '$scope', '$state', 'MasterData', 'dialogService', '$filter', 'recruitFactory', 'skillHelperService', function ($rootScope, $scope, $state, MasterData, dialogService, $filter, recruitFactory, skillHelperService) {
    'use strict';

    $scope.allSkills = MasterData.getSkills();
    $scope.roles = ($filter('filter')(MasterData.getRoles(), {
      name: '!Other'
    }));
    $scope.candidate = {
      role_id: $scope.roles[0].id
    };
    $scope.skills = [];
    $scope.roleSkillsMap = skillHelperService.constructRoleSkillsMap($scope.roles, $scope.allSkills);

    $scope.refreshSkills = function () {
      if ($scope.candidate.role_id in $scope.roleSkillsMap) {
        $scope.skills = JSON.parse(JSON.stringify($scope.roleSkillsMap[$scope.candidate.role_id]));
        $rootScope.$broadcast('roleChanged', {role_id: $scope.candidate.role_id});
      }
    };

    $scope.refreshSkills();

    $scope.blurElem = function () {
      document.querySelector('#experience').blur();
    };

    $scope.isAtleastOnePredefinedSkillSelected = function () {
      var otherCheckBox = $scope.getOtherCheckbox();
      // TODO: There should be a better way in angular to extract with a certain parameter
      for (var skillIndex in $scope.skills) {
        var value = $scope.skills[skillIndex];
        if (value.checked && ((otherCheckBox === undefined) || (otherCheckBox !== undefined && otherCheckBox.name !== value.name))) {
          return true;
        }
      }
      return false;
    };

    $scope.getOtherCheckbox = function () {
      // TODO: There should be a better way in angular to extract with a certain parameter
      for (var skillIndex in $scope.skills) {
        var value = $scope.skills[skillIndex];
        if (value.name === 'Other') {
          return value;
        }
      }
      return undefined;
    };

    $scope.isSkillFieldsValid = function () {
      if (Object.keys($scope.skills).length === 0) {
        return false;
      }
      if ($scope.isAtleastOnePredefinedSkillSelected()) {
        return true;
      }
      var otherCheckBox = $scope.getOtherCheckbox();
      return (otherCheckBox !== undefined && otherCheckBox.checked && $scope.candidate.other_skills !== undefined) === true;
    };

    $scope.isFormInvalid = function () {
      if (Object.keys($scope.skills).length === 0) {
        return false;
      }
      return !($scope.isSkillFieldsValid() && !$scope.candidateForm.$invalid);
    };

    $scope.processCandidateData = function () {
      $scope.candidate.skill_ids = [];
      $scope.candidate.first_name = $scope.firstName;
      $scope.candidate.last_name = $scope.lastName;
      // TODO: There should be a better way in angular to extract with a certain parameter
      for (var skill in $scope.skills) {
        if ($scope.skills[skill].checked) {
          $scope.candidate.skill_ids.push($scope.skills[skill].id);
        }
      }
      var otherCheckBox = $scope.getOtherCheckbox();
      if (!otherCheckBox.checked) {
        $scope.candidate.other_skills = undefined;
      }
      $state.go('schedule-interview', {candidate: $scope.candidate});
    };

    $scope.resetForm = function () {
      dialogService.askConfirmation('Discard Changes', 'Do you want to discard the changes and go back ?', function () {
        $rootScope.$broadcast('clearFormData');
        $rootScope.$broadcast('loaded:masterData');
        $state.go('tabs.interviews');
      });
    };

    $rootScope.$on('clearFormData', function () {
      $scope.candidateForm.$setPristine();
      $scope.candidate = undefined;
      // Resetting the default role
      $scope.candidate = {
        role_id: $scope.roles[0].id
      };
      $scope.firstName = undefined;
      $scope.lastName = undefined;
      $scope.refreshSkills();
    });
  }
]);
