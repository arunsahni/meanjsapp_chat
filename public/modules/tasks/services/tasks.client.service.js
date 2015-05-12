'use strict';

//Tasks service used to communicate Tasks REST endpoints
angular.module('tasks').factory('Tasks', ['$http',
	function($http) {
		var serviceFactory = {};

		serviceFactory.saveTasks = function (req, res) {
			return $http.post('/tasks/create',req);
		};
		serviceFactory.getTasks = function (req, res) {
			return $http.get('/tasks', req);
		};
		serviceFactory.updateTask = function (req,res) {
			return $http.post('/Task/update', req);
		};
		serviceFactory.getTaskById = function (req, res) {
			return $http.get('/task/' + req.taskId);
		};
		serviceFactory.updateAssigneesList = function (req, res) {
			return $http.get('/task/deleteAssignee/' + req.taskId+'/' +req.assigneeId);
		};
        serviceFactory.getTaskByUserId = function (req, res) {
            return $http.get('/tasks/myTask');
        };
		serviceFactory.updateMilestone = function (req, res) {
            return $http.post('/tasks/updateMilestone', req);
        };

		return serviceFactory;
	}
]);
