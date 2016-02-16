describe('candidateInterviewsController', function () {
  'use strict';

  beforeEach(module('recruitX'));

  var $scope = {};

  beforeEach(inject(function ($controller) {
    $controller('candidateInterviewsController', {
      $scope: $scope
    });

    $scope.interviewSet = [];
    $scope.notScheduled = 'Not Scheduled';
    $scope.interviews = {};

    $scope.interviewTypes = [{
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
      priority: 5
    }];

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
      start_time: '2016-04-03T12:27:00Z'
    }, {
      id: 39,
      name: 'Technical1',
      start_time: '2016-03-03T13:27:00Z'
    }, {
      id: '',
      name: 'Technical2',
      start_time: 'Not Scheduled'
    }, {
      id: '',
      name: 'Leadership',
      start_time: 'Not Scheduled'
    }, {
      id: '',
      name: 'P3',
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
        interviewRound = $scope.expectedInterviewScheduleList[0];
        expect($scope.isNotScheduled(interviewRound)).toEqual(false);
      });
    });
    describe('viewInterviewDetails', function () {
      it('should return interview details state for a scheduled interview', function () {
        interviewRound = $scope.expectedInterviewScheduleList[0];
        expect(angular.equals($scope.viewInterviewDetails(interviewRound), 'interview-details({id:interviewType.id})')).toBe(true);
      });
    });
    describe('viewInterviewDetails', function () {
      it('should return invalid state # for a scheduled interview', function () {
        interviewRound = $scope.expectedInterviewScheduleList[2];
        expect(angular.equals($scope.viewInterviewDetails(interviewRound), '#')).toBe(true);
      });
    });
  });
});
