angular.module('recruitX')
  .controller('panelistSignupController', function ($scope, recruitFactory, skillHelperService, $ionicPopup) {
    'use strict';

    $scope.items = [];
    $scope.isRefreshing = true;

    $scope.finishRefreshing = function () {
      $scope.isRefreshing = false;
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.doRefresh = function () {
      console.log('AM refreshing');
      recruitFactory.getInterviews({}, function (newItems) {
        $scope.items = newItems;
        $scope.parseSkillsFromSkillObject($scope.items);
        // $scope.calculateEndTime($scope.items);
        $scope.finishRefreshing();
        console.log('AM success' + $scope.items);
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.parseSkillsFromSkillObject = function (items) {
      angular.forEach(items, function (item) {
        item.candidate.all_skills = skillHelperService.getAllSkills(item.candidate.skills, item.candidate.other_skills);
      });
    };

    // $scope.calculateEndTime = function(items) {
    //   angular.forEach(items, function(item) {
    //     item.candidate_interview_date_time_end = new Date(new Date(item.start_time).getTime() + 3600000);
    //   });
    // };

    $scope.signingUp = function (item) {
      $scope.logged_in_user = 'recruitx'; // TODO: need to retrieve from okta
      $scope.interview_panelist = {
        interview_panelist: {
          'panelist_login_name': $scope.logged_in_user,
          'interview_id': item.id
        }
      };
      recruitFactory.signUp($scope.interview_panelist, function (res) {
        console.log(res);
        $scope.showAlert('Success', 'Signed Up!!');
      });
    };

    $scope.showAlert = function (alertTitle, alertText) {
      $ionicPopup.alert({
        title: alertTitle,
        template: alertText
      });
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      console.log('View loaded!');
      $scope.doRefresh();
    }, false);
  });
