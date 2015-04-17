'use strict';

//Setting up route
angular.module('companyfeeds').config(['$stateProvider',
	function($stateProvider) {
		// Companyfeeds state routing
		$stateProvider.
		state('listCompanyfeeds', {
			url: '/companyfeeds',
			templateUrl: 'modules/companyfeeds/views/list-companyfeeds.client.view.html'
		}).
		state('createCompanyfeed', {
			url: '/companyfeeds/create',
			templateUrl: 'modules/companyfeeds/views/create-companyfeed.client.view.html'
		}).
		state('viewCompanyfeed', {
			url: '/companyfeeds/:companyfeedId',
			templateUrl: 'modules/companyfeeds/views/view-companyfeed.client.view.html'
		}).
		state('editCompanyfeed', {
			url: '/companyfeeds/:companyfeedId/edit',
			templateUrl: 'modules/companyfeeds/views/edit-companyfeed.client.view.html'
		});
	}
]);
