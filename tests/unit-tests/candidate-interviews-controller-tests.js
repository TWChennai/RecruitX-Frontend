describe('candidateInterviewsController', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var $scope = {};

  beforeEach(inject(function ($controller, loggedinUserStore, MasterData) {
    var interviewTypes = [{
      id: 1,
      name: 'Code Pairing',
      priority: 1
    }, {
      id: 2,
      name: 'Technical1',
      priority: 2
    }, {
      id: 3,
      name: 'Technical2',
      priority: 3
    }, {
      id: 4,
      name: 'Leadership',
      priority: 4
    }, {
      id: 5,
      name: 'P3',
      priority: 4
    }];
    
    spyOn(loggedinUserStore, 'isRecruiter').and.returnValue('true');
    spyOn(loggedinUserStore, 'userId').and.returnValue('recruitx');
    spyOn(MasterData, 'getInterviewTypes').and.returnValue(interviewTypes);

    $controller('candidateInterviewsController', {
      $scope: $scope
    });

    $scope.interviewSet = [];
    $scope.notScheduled = 'Not Scheduled';
    $scope.interviews = {};

    $scope.interviewTypes = interviewTypes;

    $scope.interviews = [{
      start_time: '2016-04-03T13:27:00Z',
      interview_type_id: 2,
      id: 39,
      candidate: {
        skills: [
          {
            id: 1
          },
          {
            id: 2
          }
        ],
        role_id: 2,
        other_skills: null,
        name: 'final merge',
        id: 26
      }
    },
    {
      start_time: '2016-03-03T12:27:00Z',
      interview_type_id: 1,
      id: 38,
      candidate: {
        skills: [
          {
            id: 1
          },
          {
            id: 2
          }
        ],
        role_id: 2,
        other_skills: null,
        name: 'final merge',
        id: 26
      }
    }
    ];

    $scope.expectedInterviewScheduleList = [{
      id: 38,
      name: 'Code Pairing',
      priority: 1,
      start_time: '2016-04-03T12:27:00Z'
    }, {
      id: 39,
      name: 'Technical1',
      priority: 2,
      start_time: '2016-03-03T13:27:00Z'
    }, {
      id: '',
      name: 'Technical2',
      priority: 3,
      start_time: 'Not Scheduled'
    }, {
      id: '',
      name: 'Leadership',
      priority: 4,
      start_time: 'Not Scheduled'
    }, {
      id: '',
      name: 'P3',
      priority: 4,
      start_time: 'Not Scheduled'
    }];
  }));

  describe('methods', function () {
    var interviewRound = {};
    describe('buildInterviewScheduleList', function () {
      it('should build interview schedule list', function () {
        $scope.buildInterviewScheduleList();
        for (var i = 0; i < $scope.interviewSet.length; i++) {
          expect(angular.equals($scope.interviewSet[i].id, $scope.expectedInterviewScheduleList[i].id)).toBe(true);
          expect(angular.equals($scope.interviewSet[i].name, $scope.expectedInterviewScheduleList[i].name)).toBe(true);
          expect(angular.equals($scope.interviewSet[i].priority, $scope.expectedInterviewScheduleList[i].priority)).toBe(true);
        }
      });
    });
    describe('isNotScheduled', function () {
      it('should return true if an interview is not scheduled yet', function () {
        interviewRound = $scope.expectedInterviewScheduleList[2];
        expect($scope.isNotScheduled(interviewRound)).toEqual(true);
      });
    });
    describe('isNotScheduled', function () {
      it('should return false if an interview is scheduled', function () {
        interviewRound = $scope.expectedInterviewScheduleList[1];
        expect($scope.isNotScheduled(interviewRound)).toEqual(false);
      });
    });
    describe('isNextSchedulableRound', function () {
      it('should return false if an interview is scheduled', function () {
        $scope.buildInterviewScheduleList();
        interviewRound = $scope.expectedInterviewScheduleList[1];
        expect($scope.isNextSchedulableRound(interviewRound)).toEqual(false);
      });
    });
    describe('isNextSchedulableRound', function () {
      it('should return false if an interview is unscheduled and previous round is also unscheduled', function () {
        $scope.buildInterviewScheduleList();
        interviewRound = $scope.expectedInterviewScheduleList[4];
        expect($scope.isNextSchedulableRound(interviewRound)).toEqual(false);
      });
    });
    describe('isNextSchedulableRound', function () {
      it('should return true if an interview is unscheduled and previous round is scheduled', function () {
        $scope.buildInterviewScheduleList();
        interviewRound = $scope.expectedInterviewScheduleList[2];
        expect($scope.isNextSchedulableRound(interviewRound)).toEqual(true);
      });
    });
    describe('isPipelineInProgress', function () {
      it('should return false if current candidate is not yet fetched', function () {
        $scope.current_candidate = undefined;
        expect($scope.isPipelineInProgress()).toEqual(false);
      });
      it('should return false if current candidate status is not in progress', function () {
        $scope.current_candidate ={pipelineStatus: 'Closed'};
        expect($scope.isPipelineInProgress()).toEqual(false);
      });
      it('should return true if current candidate status is in progress', function () {
        $scope.current_candidate ={pipelineStatus: 'In Progress'};
        expect($scope.isPipelineInProgress()).toEqual(true);
      });
    });
  });
});
