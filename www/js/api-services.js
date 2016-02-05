angular.module('recruitX')
  .factory('recruitFactory', ['$cordovaToast', '$http', 'endpoints', function ($cordovaToast, $http, endpoints) {
    'use strict';

    var baseUrl = 'http://' + endpoints.apiUrl;
    var UNPROCESSABLE_ENTITY_STATUS = 422;

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

      // TODO: Rename this method to convey the full intent
      getInterviews: function (data, success) {
        // TODO: the 'data' argument is sent along as query string params, so why repeat the same?
        $http.get(baseUrl + '/interviews?panelist_login_name=recruitx', {
          params: data
        }).success(success).error(defaultErrorHandler);
      },

      // TODO: This should be merged with the above method
      getMyInterviews: function (data, success) {
        $http.get(baseUrl + '/panelists/recruitx/interviews', {
          params: data
        }).success(success).error(defaultErrorHandler);
      },

      getCandidateInterviews: function (id, success) {
        $http.get(baseUrl + '/candidates/' + id +'/interviews').success(success).error(defaultErrorHandler);
      },

      getInterview: function (id, success) {
        $http.get(baseUrl + '/interviews/' + id).success(success).error(defaultErrorHandler);
      },

      signUp: function (data, success, unProcessableEntityErrorHandler, customErrorHandler) {
        $http.post(baseUrl + '/panelists', data).success(success).error(
          function(error, status){
            if(status === UNPROCESSABLE_ENTITY_STATUS){
              unProcessableEntityErrorHandler(error, status);
            } else{
              defaultErrorHandler(error, status, customErrorHandler);
            }
          });
      }
    };
  }])

  .factory('MasterData', [function() {
    var interviewTypes;
    var skills;
    var roles;

    return {
      setInterviewTypes: function(i) {
        interviewTypes = i;
      },

      getInterviewTypes: function() {
        return interviewTypes;
      },

      setRoles: function(r) {
        roles = r;
      },

      getRoles: function() {
        return roles;
      },

      setSkills: function(s) {
        skills = s;
      },

      getSkills: function() {
        return skills;
      }
    };
  }]);
