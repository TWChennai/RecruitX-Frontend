angular.module('starter')
  .controller('panelistSignupController', function($scope, recruitFactory, $ionicPopup) {
    'use strict';

    $scope.items = [];

    $scope.isRefreshing = true;

    $scope.finishRefreshing = function() {
      $scope.isRefreshing = false;
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.doRefresh = function() {
      console.log('AM refreshing');
      recruitFactory.getInterviews(function(newItems) {
        $scope.items = newItems;
        $scope.parseSkillsFromSkillObject($scope.items);
        $scope.calculateEndTime($scope.items);
        $scope.finishRefreshing();
        console.log('AM success' + $scope.items);
      }, function(error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.parseSkillsFromSkillObject = function(items) {
      angular.forEach(items, function(item) {
        var skill_array = [];

        // TODO: Isn't there a better way to join an array of elements with a delimiter?
        angular.forEach(item.candidate.skills, function(skill) {
          skill_array.push(skill.name);
        });

        item.candidate.skills = String(skill_array);
      });
    };

    $scope.calculateEndTime = function(items) {
      angular.forEach(items, function(item) {
        item.candidate_interview_date_time_end = new Date(new Date(item.candidate_interview_date_time).getTime() + 3600000);
      });
    };

    $scope.signingUp = function(item) {
      $scope.logged_in_user = 'recruitx'; // TODO: need to do get from okta
      var data = { 'user' : $scope.logged_in_user, 'id': item.id };
      recruitFactory.signUp(data, function(res) {
        console.log(res);
        $scope.showAlert('Success', 'Signed Up!!');
      });
    };

    $scope.showAlert = function(alertTitle, alertText) {
      $ionicPopup.alert({
        title: alertTitle,
        template: alertText
      });
    };

    document.addEventListener('deviceready', function onDeviceReady() {
      console.log('View loaded!');
      $scope.doRefresh();
    }, false);
  })
  .controller('interviewDetailsController', function() {
  });
