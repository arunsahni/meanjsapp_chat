'use strict';

//Companyfeeds service used to communicate Companyfeeds REST endpoints
angular.module('companyfeeds').factory('Companyfeeds', ['$http',
	function($http) {
		/*return $resource('companyfeeds/:companyfeedId', { companyfeedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});*/
		var serviceFactory = {};

		serviceFactory.savecompanyfeed = function (req,res) {
			return $http.post('/companyfeeds/save', req);
		};

		serviceFactory.getcompanyfeeds = function (req, res) {
			return $http.get('/companyfeeds');
		};

		serviceFactory.getcompanyfeedById = function (req, res) {
			return $http.get('companyfeeds/' + req.companyfeedId);
		};

		serviceFactory.updatecompanyfeed = function (req,res) {
			return $http.post('/companyfeeds/update', req);
		};

		serviceFactory.deletecompanyfeed = function (req, res) {
			return $http.post('/companyfeeds/delete', req);
		};
		serviceFactory.addCommentService = function(req,res){
			return $http.post('/companyfeeds/addcomment',req);
		};
		serviceFactory.getComment = function(req,res){
			return $http.get('/companyfeeds/getcomment',req.postId);
		};
		serviceFactory.addLiker = function(req,res){
			return $http.post('/companyfeeds/addlikers',req);
		};
		serviceFactory.addCommentLike = function(req,res){
			return $http.post('/companyfeeds/addCommentLike',req);
		};
		return serviceFactory;

	}
]);
