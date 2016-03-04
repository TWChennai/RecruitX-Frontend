angular.module('recruitX')
  .controller('TabsCtrl', ['$scope', 'recruitFactory', 'skillHelperService', 'loggedinUserStore', 'dialogService', '$ionicHistory', '$state', function ($scope, recruitFactory, skillHelperService, loggedinUserStore, dialogService, $ionicHistory, $state) {
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
      if (!loggedinUserStore.isRecruiter()) {
        $scope.refreshMyInterviews();
      } else {
        $scope.refreshCandidates(1);
        refreshing = true;
      }
    };

    $scope.refreshInterviews = function () {
      console.log('AM refreshing');
      recruitFactory.getInterviews({
        panelist_login_name: loggedinUserStore.userId()
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

    $scope.refreshMyInterviews = function () {
      recruitFactory.getMyInterviews({}, function (newItems) {
        $scope.myinterviews = newItems;
        $scope.noMyInterviews = $scope.myinterviews.length === 0 ? true : false;
        $scope.finishRefreshing();
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

    $scope.signUp = function () {
      recruitFactory.signUp($scope.interview_panelist, $scope.signUpSuccessHandler, $scope.signUpUnprocessableEntityHandler, $scope.defaultErrorHandler);
    };

    $scope.signUpSuccessHandler = function (res) {
      console.log(res);
      $scope.finishRefreshing();
      dialogService.showAlertWithDismissHandler('Sign up', 'Thanks for signing up for this interview!', function () {
        $scope.manuallyRefreshInterviews();
      });
    };

    $scope.signUpUnprocessableEntityHandler = function (error) {
      $scope.finishRefreshing();
      dialogService.showAlert('Sign up', error.errors[0].reason).then(function () {
        $scope.manuallyRefreshInterviews();
      });
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
