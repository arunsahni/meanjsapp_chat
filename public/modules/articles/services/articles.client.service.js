'use strict';

//Articles service used for communicating with the articles REST endpoints
	angular.module('articles').factory('Articles', ['$http',
	function($http) {
		var serviceFactory = {};

		serviceFactory.saveArticle = function (req,res) {
			return $http.post('/article/save', req);
		};

		serviceFactory.getArticles = function (req, res) {
			return $http.get('/articles');
		};

		serviceFactory.getArticleById = function (req, res) {
			return $http.get('article/' + req.articleId);
		};

		serviceFactory.updateArticle = function (req,res) {
			return $http.post('/article/update', req);
		};

		serviceFactory.deleteArticle = function (req, res) {
			return $http.post('/article/delete', req);
		};
		serviceFactory.generatePusher = function (req, res){
			return $http.get('/pusher');
		};
		serviceFactory.paypalCreate = function (req, res){
			return $http.post('/article/paypalcreate', req);
		};
		serviceFactory.excutePayment = function (req, res){
			return $http.post('/article/excutePayment', req);
		};
		return serviceFactory;
	}
]);
