angular.module('recruitX')
  .factory('recruitFactory', ['$cordovaToast', '$http', 'apiUrl', function ($cordovaToast, $http, apiUrl) {
    'use strict';

    var baseUrl = 'http://' + apiUrl;

    var getErrorMessage = function (status) {
      switch (status) {
        default: return 'Something went wrong while processing your request.Please try again soon';
      }
    };

    var defaultErrorHandler = function (err, status, customError) {
      $cordovaToast.showShortBottom(getErrorMessage(status));

      // console.log(getErrorMessage(status));
      customError();
    };

    return {
      // Master data calls
      getRoles: function (success) {
        $http.get(baseUrl + '/roles').success(success).error(defaultErrorHandler);
      },

      getSkills: function (success) {
        $http.get(baseUrl + '/skills').success(success).error(defaultErrorHandler);
      },

      getInterviewTypes: function (success) {
        $http.get(baseUrl + '/interview_types').success(success).error(defaultErrorHandler);
      },

      // Transactional data calls
      getCandidates: function (success, customError) {
        $http.get(baseUrl + '/candidates').success(success).error(function (err, status) {
          defaultErrorHandler(err, status, customError);
        });
      },

      getCandidate: function (candidate_id, successCallback, failureCallback) {
        // TODO: Not sure if appending to the endpoint URL is okay

        $http.get(baseUrl + '/candidates/' + candidate_id).then(successCallback, failureCallback);
      },

      saveCandidate: function (data, success) {
        $http.post(baseUrl + '/candidates', data).success(success).error(defaultErrorHandler);
      },

      getInterviews: function (data, success) {
        $http.get(baseUrl + '/interviews?panelist_login_name=dinesh', {
          params: data
        }).success(success).error(defaultErrorHandler);
      },

      getInterview: function (id, success) {
        $http.get(baseUrl + '/interviews/' + id).success(success).error(defaultErrorHandler);
      },

      saveSignup: function (data, success) {
        // TODO: Need a better RESTful url

        $http.post(baseUrl + '/interview_panelists', data).success(success).error(defaultErrorHandler);
      }
    };
  }]);
