'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {

	app.post('/article/save', function(req, res) {
		articles.create(req, res);
	});

	app.get('/articles', function(req, res) {

		articles.list(req, res);
	});


	app.get('/article/:id', function(req, res) {
		articles.articleByID(req, res);
	});

	app.post('/article/update', function(req, res) {
		articles.update(req, res);
	});

	app.post('/article/delete', function(req, res) {
		articles.delete(req, res);
	});

	app.get('/pusher',function(req,res){
		articles.generatePusher(req,res);
	})
};
