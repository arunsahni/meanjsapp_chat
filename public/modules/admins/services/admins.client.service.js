'use strict';

//Admins service used to communicate Admins REST endpoints
angular.module('admins').factory('Admins', ['$http',
	function($http) {
		var adminFactory = {};

		adminFactory.userList = function (req,res) {
			return $http.get('/allUsers', req);
		};

		adminFactory.updateUserRole = function (req,res) {
			return $http.post('/changeRole', req);
		};
		adminFactory.pushAccess = function (req,res) {
			return $http.post('/pushAccess', req);
		};
		adminFactory.popAccess = function (req,res) {
			return $http.post('/popAccess', req);
		};
		return adminFactory;
	}
]);
