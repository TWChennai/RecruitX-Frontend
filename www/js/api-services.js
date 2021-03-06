angular.module('recruitX')
  .factory('recruitFactory', ['$cordovaToast', '$http', 'apiUrl', 'skillHelperService', '$filter', 'MasterData', 'loggedinUserStore', '$cordovaNetwork', function ($cordovaToast, $http, apiUrl, skillHelperService, $filter, MasterData, loggedinUserStore, $cordovaNetwork) {
    'use strict';

    var UNPROCESSABLE_ENTITY_STATUS = 422;
    var PRECONDITION_FAILED_ERROR = 428;

    var getErrorMessage = function (status) {
      // TODO: Need to add more statuses to the switch
      switch (status) {
        case 0:
          var isOffline = $cordovaNetwork.isOffline();
          if (isOffline) {
            return 'Please check your internet connection';
          } else {
            return 'Something went wrong while processing your request. Please try again soon.';
          }
          break;
        default:
          return 'Something went wrong while processing your request. Please try again soon.';
      }
    };

    var defaultErrorHandler = function (err, status, customError) {
      $cordovaToast.showShortBottom(getErrorMessage(status));
      if (customError !== undefined) {
        customError();
      }
    };

    var load_and_flesh = function (flesh_out_fn, input) {
      if (MasterData.isLoaded()) {
        flesh_out_fn(input);
      } else {
        MasterData.load().then(function () {
          flesh_out_fn(input);
        });
      }
    };

    var fleshOutCandidate = function (candidate_input) {
      load_and_flesh(function (candidate) {
        candidate.name = candidate.first_name + ' ' + candidate.last_name;
        candidate.all_skills = skillHelperService.formatAllSkills(candidate.skills, candidate.other_skills);
        candidate.role = (($filter('filter')(MasterData.getRoles(), {
          id: candidate.role_id
        }))[0]).name;
        candidate.pipelineStatus = (($filter('filter')(MasterData.getPipelineStatuses(), {
          id: candidate.pipeline_status_id
        }))[0]).name;
      }, candidate_input);
    };

    var fleshOutCandidates = function (candidates_input) {
      load_and_flesh(function (candidates) {
        for (var candidateIndex in candidates) {
          fleshOutCandidate(candidates[candidateIndex]);
        }
      }, candidates_input);
    };

    var fleshOutInterview = function (interview_input) {
      load_and_flesh(function (interview) {
        interview.interview_type = ($filter('filter')(MasterData.getInterviewTypes(), {
          id: interview.interview_type_id
        }))[0];
        if (interview.panelists !== undefined) {
          // TODO: This seems like a temp placeholder - so why store in the interview?
          interview.panelistsArray = [];
          for (var interviewPanelistIndex in interview.panelists) {
            interview.panelistsArray.push(interview.panelists[interviewPanelistIndex].name);
          }
          interview.formattedPanelists = interview.panelistsArray.join(', ');
        }
        var interviewStatusId = interview.status_id;
        interview.status = ($filter('filter')(MasterData.getInterviewStatuses(), {
          id: interviewStatusId
        }))[0];
        if (!(interview.last_interview_status === null)) {
          interview.lastInterviewStatusName = ($filter('filter')(MasterData.getInterviewStatuses(), {
            id: interview.last_interview_status
          }))[0].name;
        }
        fleshOutCandidate(interview.candidate);
      }, interview_input);
    };

    var fleshOutInterviews = function (interviews_input) {
      load_and_flesh(function (interviews) {
        // TODO: Please use a consistent for construct
        for (var interviewIndex in interviews) {
          fleshOutInterview(interviews[interviewIndex]);
        }
      }, interviews_input);
    };

    return {
      // Master data calls
      getRoles: function (success, customError) {
        $http.get(apiUrl + '/roles').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getSkills: function (success, customError) {
        $http.get(apiUrl + '/skills').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getInterviewTypes: function (success, customError) {
        $http.get(apiUrl + '/interview_types').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getPipelineStatuses: function (success, customError) {
        $http.get(apiUrl + '/pipeline_statuses').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      // Transactional data calls
      isRecruiter: function (employee_id, success, customError) {
        $http.get(apiUrl + '/is_recruiter/' + employee_id).success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getCandidate: function (candidate_id, success, failureCallback) {
        $http.get(apiUrl + '/candidates/' + candidate_id).success(function (response) {
          fleshOutCandidate(response);
          success(response);
        }).error(function (err, status) {
          defaultErrorHandler(err, status, failureCallback);
        });
      },

      getSlots: function (data, success, error) {
        $http.get(apiUrl + '/slots', {
          params: data
        }).then(success, error);
      },

      saveCandidate: function (data, success, error) {
        $http.post(apiUrl + '/candidates', data).then(success, error);
      },

      saveSlots: function (data, success, error) {
        $http.post(apiUrl + '/slots', data).then(success, error);
      },

      convertSlotsToInterview: function(data, success, error) {
        $http.post(apiUrl + '/slot_to_interview', data).then(success, error);
      },

      // TODO: Rename this method to convey the full intent
      getInterviews: function (data, success, customError) {
        // TODO: the 'data' argument is sent along as query string params, so why repeat the same?
        $http.get(apiUrl + '/interviews', {
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
        $http.get(apiUrl + '/panelists/' + loggedinUserStore.userId() + '/interviews', {
          params: data
        }).success(function (response) {
          fleshOutInterviews(response.interviews);
          success(response.interviews, response.total_pages);
        }).error(function (err, status) {
          defaultErrorHandler(err, status, customError);
        });
      },

      getAllCandidates: function (data, success) {
        $http.get(apiUrl + '/candidates', {
          params: data
        }).success(function (response) {
          fleshOutCandidates(response.candidates);
          success(response.candidates, response.total_pages);
        })
          .error(function () {});
      },

      // TODO: This should be merged with the above method
      getCandidateInterviews: function (id, success, customError) {
        $http.get(apiUrl + '/candidates/' + id + '/interviews')
          .success(function (response) {
            fleshOutInterviews(response);
            success(response);
          }).error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      getInterview: function (id, success, customError) {
        $http.get(apiUrl + '/interviews/' + id)
          .success(function (response) {
            fleshOutInterview(response);
            success(response);
          }).error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      signUp: function (data, success, unProcessableEntityErrorHandler, customErrorHandler) {
        $http.post(apiUrl + '/panelists', data).success(success).error(
          function (error, status) {
            if (status === UNPROCESSABLE_ENTITY_STATUS) {
              unProcessableEntityErrorHandler(error, status);
            } else {
              defaultErrorHandler(error, status, customErrorHandler);
            }
          });
      },

      deleteInterviewPanelist: function (data, success, unProcessableEntityErrorHandler, customErrorHandler) {
        $http.delete(apiUrl + '/panelists/' + data).success(success).error(
          function (error, status) {
            if (status === UNPROCESSABLE_ENTITY_STATUS) {
              unProcessableEntityErrorHandler(error, status);
            } else {
              defaultErrorHandler(error, status, customErrorHandler);
            }
          });
      },

      deleteSlotPanelist: function (data, success, unProcessableEntityErrorHandler, customErrorHandler) {
        $http.delete(apiUrl + '/decline_slot/' + data).success(success).error(
          function (error, status) {
            if (status === UNPROCESSABLE_ENTITY_STATUS) {
              unProcessableEntityErrorHandler(error, status);
            } else {
              defaultErrorHandler(error, status, customErrorHandler);
            }
          });
      },

      removeInterviewPanelist: function (data, success, unProcessableEntityErrorHandler, customErrorHandler) {
        $http.delete(apiUrl + '/remove_panelists/' + data).success(success).error(
          function (error, status) {
            if (status === UNPROCESSABLE_ENTITY_STATUS) {
              unProcessableEntityErrorHandler(error, status);
            } else {
              defaultErrorHandler(error, status, customErrorHandler);
            }
          });
      },

      getInterviewStatus: function (success, customError) {
        $http.get(apiUrl + '/interview_statuses').success(success)
          .error(function (err, status) {
            defaultErrorHandler(err, status, customError);
          });
      },

      updateInterviewSchedule: function (data, id, success, failure) {
        $http.put(apiUrl + '/interviews/' + id, data).then(success, failure);
      },

      createInterviewSchedule: function (data, success, failure) {
        $http.post(apiUrl + '/interviews', data).then(success, failure);
      },

      closePipeline: function (data, id, success, failure) {
        data.office = loggedinUserStore.office()
        
        $http.put(apiUrl + '/candidates/' + id, data).then(success, failure);
      },

      sendSos: function (data, success, email_not_sent_handler, failure) {
        $http.get(apiUrl + '/sos_email', {
          params: data
        }).then(success, function(err, status) {
          if(err.status === PRECONDITION_FAILED_ERROR) {
            email_not_sent_handler();
          } else {
            failure();
          }
        });
      },

      getSosStatus: function (success) {
        var data = {
          'get_status': true,
          'office': loggedinUserStore.office()
        };
        $http.get(apiUrl + '/sos_email?', {
          params: data
        }).then(success);
      }
    };
  }])

.factory('MasterData', ['$http', '$q', 'apiUrl', function ($http, $q, apiUrl) {
  'use strict';

  var data;

  return {
    isLoaded: function () {
      return data !== undefined;
    },

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
      // console.log('LOADING MASTER DATA ******************');
      return $q.all([$http.get(apiUrl + '/interview_types'), $http.get(apiUrl + '/roles'), $http.get(apiUrl + '/skills'), $http.get(apiUrl + '/interview_statuses'), $http.get(apiUrl + '/pipeline_statuses')])
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
