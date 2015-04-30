'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var companyfeeds = require('../../app/controllers/companyfeeds.server.controller');

	// Companyfeeds Routes
	/*app.route('/companyfeeds')
		.get(companyfeeds.list)
		.post(users.requiresLogin, companyfeeds.create);

	app.route('/companyfeeds/:companyfeedId')
		.get(companyfeeds.read)
		.put(users.requiresLogin, companyfeeds.hasAuthorization, companyfeeds.update)
		.delete(users.requiresLogin, companyfeeds.hasAuthorization, companyfeeds.delete);

	// Finish by binding the Companyfeed middleware
	app.param('companyfeedId', companyfeeds.companyfeedByID);*/
	app.post('/companyfeeds/save', function(req, res) {
		companyfeeds.create(req, res);
	});
	app.get('/companyfeeds', function(req, res) {
		companyfeeds.list(req, res);
	});
	app.get('/companyfeeds/:id', function(req, res) {
		companyfeeds.companyfeedByID(req, res);
	});
	app.post('/companyfeeds/update', function(req, res) {
		companyfeeds.update(req, res);
	});
	app.post('/companyfeeds/delete', function(req, res) {
		companyfeeds.delete(req, res);
	});
	app.post('/companyfeeds/addcomment', function(req, res) {
		companyfeeds.addComment(req, res);
	});
	app.post('/companyfeeds/addlikers', function(req, res) {
		companyfeeds.addLikers(req, res);
	});
    app.post('/companyfeeds/removeLiker', function(req, res) {
		companyfeeds.removeLiker(req, res);
	});
	app.post('/companyfeeds/addCommentLike', function(req, res) {
		companyfeeds.addCommentLike(req, res);
	});
    app.post('/companyfeeds/removeCommentLike', function(req, res) {
		companyfeeds.removeCommentLike(req, res);
	});
    app.post('/companyfeeds/getcompanyfeedByUserId', function(req, res) {
        companyfeeds.getcompanyfeedByUserId(req, res);
    });
};
