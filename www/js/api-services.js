angular.module('recruitX')
  .factory('recruitFactory', ['$cordovaToast', '$http', 'endpoints', 'skillHelperService', function ($cordovaToast, $http, endpoints, skillHelperService) {
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

    var populateAllSkillsOnCandidate = function (candidate) {
      candidate.all_skills = skillHelperService.formatAllSkills(candidate.skills, candidate.other_skills);
    };

    var populateRoleOnCandidate = function (candidate) {
      candidate.role = ($filter('filter')(MasterData.getRoles(), {
        id: candidate.role_id
      }))[0];
    };

    var populateCandidateOnInterviews = function (items) {
      // TODO: Please use a consistent for construct
      angular.forEach(items, function (item) {
        populateAllSkillsOnCandidate(item.candidate);
      });
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
        $http.get(baseUrl + '/candidates').success(function (response) {
          // TODO: Please use a consistent for construct
          angular.forEach(response.data, function (item) {
            populateAllSkillsOnCandidate(item);
            populateRoleOnCandidate(item);
          });
          success(response);
        }).error(function (err, status) {
          defaultErrorHandler(err, status, customError);
        });
      },

      getCandidate: function (candidate_id, success, failureCallback) {
        $http.get(baseUrl + '/candidates/' + candidate_id).success(function (response) {
          populateAllSkillsOnCandidate(response.data);
          populateRoleOnCandidate(response.data);
          success(response);
        }).error(failureCallback);
      },

      saveCandidate: function (data, success) {
        $http.post(baseUrl + '/candidates', data).success(success).error(defaultErrorHandler);
      },

      // TODO: Rename this method to convey the full intent
      getInterviews: function (data, success) {
        // TODO: the 'data' argument is sent along as query string params, so why repeat the same?
        $http.get(baseUrl + '/interviews?panelist_login_name=recruitx', {
          params: data
        }).success(function (response) {
          populateCandidateOnInterviews(response);
          success(response);
        }).error(defaultErrorHandler);
      },

      // TODO: This should be merged with the above method
      getMyInterviews: function (data, success) {
        $http.get(baseUrl + '/panelists/recruitx/interviews', {
          params: data
        }).success(function (response) {
          populateCandidateOnInterviews(response);
          success(response);
        }).error(defaultErrorHandler);
      },

      getCandidateInterviews: function (id, success) {
        $http.get(baseUrl + '/candidates/' + id + '/interviews').success(success).error(defaultErrorHandler);
      },

      getInterview: function (id, success) {
        $http.get(baseUrl + '/interviews/' + id).success(success).error(defaultErrorHandler);
      },

      signUp: function (data, success, unProcessableEntityErrorHandler, customErrorHandler) {
        $http.post(baseUrl + '/panelists', data).success(success).error(
          function (error, status) {
            if (status === UNPROCESSABLE_ENTITY_STATUS) {
              unProcessableEntityErrorHandler(error, status);
            } else {
              defaultErrorHandler(error, status, customErrorHandler);
            }
          });
      }
    };
  }])

.factory('MasterData', [function () {
  var interviewTypes;
  var skills;
  var roles;

  return {
    setInterviewTypes: function (i) {
      interviewTypes = i;
    },

    getInterviewTypes: function () {
      return interviewTypes;
    },

    setRoles: function (r) {
      roles = r;
    },

    getRoles: function () {
      return roles;
    },

    setSkills: function (s) {
      skills = s;
    },

    getSkills: function () {
      return skills;
    }
  };
}]);
