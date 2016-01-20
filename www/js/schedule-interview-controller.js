angular.module('starter')
.controller('scheduleInterviewController', function($scope, $stateParams, $cordovaDatePicker, recruitFactory,  $filter){
  $stateParams.candidate.interviewSchedule = [];
  var interviewMap = {};
  /* Get Interview Rounds */
  recruitFactory.getInterviewRounds(function(interviewRounds){
    $scope.interviewRounds = interviewRounds;
  });

  $scope.dateTime = function(index) {

      var options = {
        date: new Date(),
        mode: 'datetime',
        allowOldDates: false,
        minDate: new Date()
      };

      $cordovaDatePicker.show(options).then(function (dateTime) {
        $scope.interviewRounds[index].dateTime = dateTime;

      });
    };

    $scope.isFormInvalid = function(){
      var inValid = true;
      for (var interviewRoundIndex in $scope.interviewRounds) {
        if ($scope.interviewRounds[interviewRoundIndex].dateTime !== undefined) {
          return false;
        }
      }
      return true;
    };

    $scope.postCandidate = function () {
      for (var interviewRoundIndex in $scope.interviewRounds) {
        if ($scope.interviewRounds[interviewRoundIndex].dateTime !== undefined) {
          var formattedDateTime = $filter('date')($scope.interviewRounds[interviewRoundIndex].dateTime, 'yyyy-MM-dd HH:mm:ss');
          $stateParams.candidate.interviewSchedule.push({'interview_id': $scope.interviewRounds[interviewRoundIndex].id,
          'candidate_interview_date_time': formattedDateTime});
        }
      }

      recruitFactory.saveCandidate($stateParams, function (res) {
        //alert(res);
        console.log(res);
      });

      // var candidate = new Candidate($stateParams)
      // candidate.$save()
    };
  });
