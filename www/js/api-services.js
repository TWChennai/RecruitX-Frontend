angular.module('recruitX')
  .factory('recruitFactory', ['$cordovaToast', '$http', 'endpoints', 'skillHelperService', '$filter', 'MasterData', 'loggedinUserStore', function ($cordovaToast, $http, endpoints, skillHelperService, $filter, MasterData, loggedinUserStore) {
    'use strict';

    var baseUrl = 'http://' + endpoints.apiUrl;
    var UNPROCESSABLE_ENTITY_STATUS = 422;

    var getErrorMessage = function (status) {
      // TODO: Need to add more statuses to the switch
      switch (status) {
        default: return 'Something went wrong while processing your request. Please try again soon.';
      }
    };

    var defaultErrorHandler = function (err, status, customError) {
      $cordovaToast.showShortBottom(getErrorMessage(status));

      // console.log(getErrorMessage(status));
      if (customError !== undefined) {
        customError();
      }
    };

    var fleshOutCandidate = function (candidate) {
      candidate.name = candidate.first_name + ' ' + candidate.last_name;
      candidate.all_skills = skillHelperService.formatAllSkills(candidate.skills, candidate.other_skills);
      candidate.role = (($filter('filter')(MasterData.getRoles(), {
        id: candidate.role_id
      }))[0]).name;
      candidate.pipelineStatus = (($filter('filter')(MasterData.getPipelineStatuses(), {
        id: candidate.pipeline_status_id
      }))[0]).name;
    };

    var fleshOutCandidates = function (candidates) {
      for(var candidateIndex in candidates){
        fleshOutCandidate(candidates[candidateIndex]);
      }
    };

    var fleshOutInterview = function (interview) {
      interview.interview_type = ($filter('filter')(MasterData.getInterviewTypes(), {
        id: interview.interview_type_id
      }))[0];
      if (interview.panelists !== undefined) {
        // TODO: This seems like a temp placeholder - so why store in the interview?
        interview.panelistsArray = [];
        for(var interviewPanelistIndex in interview.panelists){
          interview.panelistsArray.push(interview.panelists[interviewPanelistIndex].name);
        }
        interview.formattedPanelists = interview.panelistsArray.join(', ');
      }
      var interviewStatusId = interview.status_id;
      interview.status = ($filter('filter')(MasterData.getInterviewStatuses(), {
        id: interviewStatusId
      }))[0];
      fleshOutCandidate(interview.candidate);
    };

    var fleshOutInterviews = function (interviews) {
      // TODO: Please use a consistent for construct
      for(var interviewIndex in interviews){
        fleshOutInterview(interviews[interviewIndex]);
      }
    };

    return {
      // Master data calls
      getRoles: function (success, customError) {
        $http.get(baseUrl + '/roles').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getSkills: function (success, customError) {
        $http.get(baseUrl + '/skills').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getInterviewTypes: function (success, customError) {
        $http.get(baseUrl + '/interview_types').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getPipelineStatuses: function (success, customError) {
        $http.get(baseUrl + '/pipeline_statuses').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      // Transactional data calls
      isRecruiter: function (employee_id, success, customError) {
        $http.get(baseUrl + '/is_recruiter/' + employee_id).success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getCandidate: function (candidate_id, success, failureCallback) {
        $http.get(baseUrl + '/candidates/' + candidate_id).success(function (response) {
          fleshOutCandidate(response);
          success(response);
        }).error(function (err, status) {
          defaultErrorHandler(err, status, failureCallback);
        });
      },

      saveCandidate: function (data, success, customError) {
        $http.post(baseUrl + '/candidates', data)
          .success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      // TODO: Rename this method to convey the full intent
      getInterviews: function (data, success, customError) {
        // TODO: the 'data' argument is sent along as query string params, so why repeat the same?
        $http.get(baseUrl + '/interviews', {
          params: data
        }).success(function (response) {
          fleshOutInterviews(response);
          success(response);
        }).error(function (err, status) {
          defaultErrorHandler(err, status, customError);
        });
      },

      // TODO: This should be merged with the above method
      getMyInterviews: function (data, success, customError) {
        $http.get(baseUrl + '/panelists/' + loggedinUserStore.userId() + '/interviews', {
          params: data
        }).success(function (response) {
          fleshOutInterviews(response);
          success(response);
        }).error(function (err, status) {
          defaultErrorHandler(err, status, customError);
        });
      },

      getAllCandidates: function (data, success) {
        $http.get(baseUrl + '/candidates', {
          params: data
        }).success(function (response) {
          fleshOutCandidates(response.candidates);
          success(response.candidates, response.total_pages);
        })
          .error(function (err, status) {});
      },

      // TODO: This should be merged with the above method
      getCandidateInterviews: function (id, success, customError) {
        $http.get(baseUrl + '/candidates/' + id + '/interviews')
          .success(function (response) {
            fleshOutInterviews(response);
            success(response);
          }).error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getInterview: function (id, success, customError) {
        $http.get(baseUrl + '/interviews/' + id)
          .success(function (response) {
            fleshOutInterview(response);
            success(response);
          }).error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
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
      },

      getInterviewStatus: function (success, customError) {
        $http.get(baseUrl + '/interview_statuses').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      updateInterviewSchedule: function (data, id, success, failure) {
        $http.put(baseUrl + '/interviews/' + id, data).then(success, failure);
      },

      createInterviewSchedule: function (data, success, failure) {
        $http.post(baseUrl + '/interviews', data).then(success, failure);
      },

      closePipeline: function (data, id, success, failure) {
        $http.put(baseUrl + '/candidates/' + id, data).then(success, failure);
      }
    };
  }])

.factory('MasterData', ['$http', '$q', 'endpoints', function ($http, $q, endpoints) {
  'use strict';

  var baseUrl = 'http://' + endpoints.apiUrl;
  var data;

  return {
    getInterviewTypes: function () {
      return data.interviewTypes;
    },

    getRoles: function () {
      return data.roles;
    },

    getSkills: function () {
      return data.skills;
    },

    getInterviewStatuses: function () {
      return data.interviewStatuses;
    },

    getPipelineStatuses: function () {
      return data.pipelineStatuses;
    },

    load: function () {
      return $q.all([$http.get(baseUrl + '/interview_types'), $http.get(baseUrl + '/roles'), $http.get(baseUrl + '/skills'), $http.get(baseUrl + '/interview_statuses'), $http.get(baseUrl + '/pipeline_statuses')])
        .then(function (response) {
          data = {
            interviewTypes: response[0].data,
            roles: response[1].data,
            skills: response[2].data,
            interviewStatuses: response[3].data,
            pipelineStatuses: response[4].data
          };
          return data;
        }, function (err) {
          return $q.reject(err);
        });
    }
  };
}]);
