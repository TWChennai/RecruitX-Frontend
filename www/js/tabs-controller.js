angular.module('recruitX')
  .controller('TabsCtrl', ['$scope', 'recruitFactory', 'skillHelperService', 'loggedinUserStore', 'dialogService', '$ionicHistory', '$state', '$filter', function ($scope, recruitFactory, skillHelperService, loggedinUserStore, dialogService, $ionicHistory, $state, $filter) {
    'use strict';

    var refreshing = false;
    $scope.items = [];
    $scope.loggedinUserName = loggedinUserStore.userFirstName();
    $scope.isLoggedinUserRecruiter = loggedinUserStore.isRecruiter();
    $scope.all_candidates = [];
    $scope.next_requesting_page = 1;
    $scope.total_pages = 1;
    $scope.noMyInterviews = true;
    $scope.noItems = true;
    $scope.noCandidates = true;

    $scope.finishRefreshing = function () {
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.manuallyRefreshInterviews = function () {
      $scope.refreshInterviews();
      refreshing = true;
      if (!loggedinUserStore.isRecruiter()) {
        $scope.refreshMyInterviews(1);
      } else {
        $scope.refreshCandidates(1);
      }
    };

    var calculateExperience = function(hire_date) {
      var total_months = 12;
      var formatted_hire_date = new Date(hire_date);
      var now = new Date();
      var hire_date_in_year = formatted_hire_date.getYear() + (formatted_hire_date.getMonth() + 1)/total_months;
      var now_in_year = now.getYear() + (now.getMonth() + 1)/total_months;
      return now_in_year - hire_date_in_year;
    };

    $scope.refreshInterviews = function () {
      recruitFactory.getInterviews({
        panelist_login_name: loggedinUserStore.userId(),
        total_experiences: Math.round((loggedinUserStore.pastExperience() + calculateExperience(loggedinUserStore.calculatedHireDate())) * 100) / 100
      }, function (newItems) {
        $scope.items = newItems;
        $scope.noItems = $scope.items.length === 0 ? true : false;
        $scope.finishRefreshing();
        console.log('AM success' + $scope.items);
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.refreshMyInterviews = function (page_number) {
      var data = {
        'page': page_number
      };
      if (page_number === 1) {
        $scope.next_requesting_page = 1;
        $scope.myinterviews = [];
      }
      recruitFactory.getMyInterviews(data, function (myinterviews, total_pages) {
        $scope.myinterviews = $scope.myinterviews.concat(myinterviews);
        $scope.noMyInterviews = $scope.myinterviews.length === 0 ? true : false;
        $scope.total_pages = total_pages;
        $scope.next_requesting_page++;
        $scope.finishRefreshing();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        refreshing = false;
      }, function (error) {
        console.log('AM custom error' + error);
        $scope.finishRefreshing();
      });
    };

    $scope.refreshCandidates = function (page_number) {
      var data = {
        'page': page_number
      };
      if (page_number === 1) {
        $scope.next_requesting_page = 1;
        $scope.all_candidates = [];
      }
      recruitFactory.getAllCandidates(data, function (candidates, total_pages) {
        $scope.all_candidates = $scope.all_candidates.concat(candidates);
        $scope.noCandidates = $scope.all_candidates.length === 0 ? true : false;
        $scope.total_pages = total_pages;
        $scope.next_requesting_page++;
        $scope.finishRefreshing();
        //TODO: Do this in a better way to avoid multiple calls to backend during pagination
        $scope.$broadcast('scroll.infiniteScrollComplete');
        refreshing = false;
      });
    };

    $scope.loadMoreCandidates = function () {
      if (!refreshing && $scope.next_requesting_page <= $scope.total_pages) {
        $scope.refreshCandidates($scope.next_requesting_page);
      }
      else {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    };

    $scope.loadMoreMyInterviews = function () {
      if (!refreshing && $scope.next_requesting_page <= $scope.total_pages) {
        $scope.refreshMyInterviews($scope.next_requesting_page);
      }
      else {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    };

    $scope.signingUp = function ($event, item) {
      $event.stopPropagation();
      $scope.interview_panelist = {
        interview_panelist: {
          'panelist_login_name': loggedinUserStore.userId(),
          'interview_id': item.id
        }
      };
      dialogService.askConfirmation('Sign up', 'Are you sure you want to sign up for this interview?', $scope.signUp);
    };

    $scope.decliningInterview = function ($event, myinterview) {
      $event.stopPropagation();
      $scope.interview_panelist_id = (($filter('filter')(myinterview.panelists, function(panelist) {
        return panelist.name === loggedinUserStore.userId();
      }))[0]).interview_panelist_id;
      dialogService.askConfirmation('Decline', 'Are you sure you want to decline this interview?', $scope.declineInterview);
    };

    $scope.signUp = function () {
      recruitFactory.signUp($scope.interview_panelist, $scope.signUpSuccessHandler, $scope.signUpUnprocessableEntityHandler, $scope.defaultErrorHandler);
    };

    $scope.declineInterview = function () {
      recruitFactory.deleteInterviewPanelist($scope.interview_panelist_id, $scope.declineInterviewSuccessHandler, $scope.declineUnprocessableEntityHandler, $scope.defaultErrorHandler);
    };

    var successHandler = function(header, message){
      $scope.finishRefreshing();
      dialogService.showAlertWithDismissHandler(header, message, function () {
        $scope.manuallyRefreshInterviews();
      });
    };

    var unprocessableEntityHandler = function(error, header) {
      $scope.finishRefreshing();
      dialogService.showAlert(header, error.errors[0].reason).then(function () {
        $scope.manuallyRefreshInterviews();
      });
    };

    $scope.signUpSuccessHandler = function () {
      successHandler('Sign up', 'Thanks for signing up for this interview!');
    };

    $scope.declineInterviewSuccessHandler = function () {
      successHandler('Decline', 'Successfully declined for this interview');
    };

    $scope.signUpUnprocessableEntityHandler = function (error) {
      unprocessableEntityHandler(error, 'Sign up');
    };

    $scope.declineUnprocessableEntityHandler = function (error) {
      unprocessableEntityHandler(error, 'Decline');
    };

    $scope.defaultErrorHandler = function () {
      $scope.finishRefreshing();
    };

    $scope.logout = function () {
      dialogService.askConfirmation('Logout', 'Are you sure you want to logout?', function () {
        loggedinUserStore.clearDb();
        $ionicHistory.nextViewOptions({
          disableBack: true,
          disableAnimate: true
        });

        $state.go('login');
      });
    };

    $scope.isInPipeline = function (candidate) {
      return candidate !== undefined && candidate.pipelineStatus !== 'Closed';
    };

    $scope.isInFuture = function (start_time) {
      return new Date() < new Date(start_time);
    };

    $scope.isActive = function(stateName) {
      return stateName === $state.current.name;
    };

    $scope.$on('loaded:masterData', function () {
      $scope.manuallyRefreshInterviews();
    });

    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      // For Home Button
      $ionicHistory.clearHistory();
      viewData.enableBack = false;
    });

    (function () {
      $scope.manuallyRefreshInterviews();
    })();
  }
  ]);
