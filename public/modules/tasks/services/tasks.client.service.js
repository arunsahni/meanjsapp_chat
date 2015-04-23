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
		return serviceFactory;
	}
]);
