'use strict';

//Setting up route
angular.module('admins').config(['$stateProvider',
	function($stateProvider) {
		// Admins state routing
		$stateProvider.
			state('userlist', {
			url: '/userlist',
			templateUrl: 'modules/admins/views/userList.html'
			});
	}
]);
