'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
        state('deshboard', {
            url: '/deshboard',
            templateUrl: 'modules/core/views/home.client.view.html'
        });
	}
]);
