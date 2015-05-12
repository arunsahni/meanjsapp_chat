'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		}).
		state('newPayment', {
			url: '/articles/views/newpayment/:redirectUrl',
			templateUrl: 'modules/articles/views/newpayment.client.view.html'
		}).
		state('payPalCreate', {
			url: '/articles/views/paypalcreate',
			templateUrl: 'modules/articles/views/paypal.client.view.html'
		}).
		state('payPalexcute', {
			url: '/paypalexcute',
			templateUrl: 'modules/articles/views/excutepaypal.client.view.html'
		});
	}
]);
