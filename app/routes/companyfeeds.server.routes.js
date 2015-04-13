'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var companyfeeds = require('../../app/controllers/companyfeeds.server.controller');

	// Companyfeeds Routes
	app.route('/companyfeeds')
		.get(companyfeeds.list)
		.post(users.requiresLogin, companyfeeds.create);

	app.route('/companyfeeds/:companyfeedId')
		.get(companyfeeds.read)
		.put(users.requiresLogin, companyfeeds.hasAuthorization, companyfeeds.update)
		.delete(users.requiresLogin, companyfeeds.hasAuthorization, companyfeeds.delete);

	// Finish by binding the Companyfeed middleware
	app.param('companyfeedId', companyfeeds.companyfeedByID);
};
