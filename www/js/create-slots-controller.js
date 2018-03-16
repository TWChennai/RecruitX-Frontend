angular.module('recruitX')
  .controller('createSlotsController', ['$scope', 'MasterData', '$filter', '$cordovaDatePicker', 'recruitFactory', 'dialogService', '$timeout', '$rootScope', '$state', 'loggedinUserStore', function ($scope, MasterData, $filter, $cordovaDatePicker, recruitFactory, dialogService, $timeout, $rootScope, $state, loggedinUserStore) {
    'use strict';

    $scope.roles = ($filter('filter')(MasterData.getRoles(), {
      name: '!Other'
    }));

    $scope.interviewRounds = MasterData.getInterviewTypes();

    $scope.slot = {
      role_id: $scope.roles[0].id,
      interview_type_id: $scope.interviewRounds[2].id,
      office: loggedinUserStore.office(),
      count: 1
    };

    $scope.dateTime = function () {
      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        minDate: (new Date()).valueOf()
      };

      $cordovaDatePicker.show(options).then(function (dateTime) {
        var now = new Date(Date.now());
        if (dateTime < now) {
          dialogService.showAlert('Invalid Selection', 'Should be in future');
          return;
        }
        if (dateTime > now.setMonth(now.getMonth() + 1)) {
          dialogService.showAlert('Invalid Selection', 'Should be less than a month');
          return;
        }
        $scope.slot.start_time = dateTime;
      });
    };

    $scope.isFormInvalid = function() {
      return $scope.slotForm.$invalid || $scope.slot.start_time === undefined;
    };

    var redirectToHomePage = function () {
      $timeout(function () {
        $rootScope.$broadcast('clearFormData');
        $rootScope.$broadcast('loaded:masterData');
      });
      $state.go('tabs.interviews');
    };

    $scope.saveSlot = function() {
      recruitFactory.saveSlots({slot: $scope.slot}, function () {
        dialogService.showAlertWithDismissHandler('Success', 'Slot successfully added!!', redirectToHomePage);
      }, function () {
        dialogService.showAlertWithDismissHandler('Failed', 'Failed to create slot');
      });
    };
  }
]);
