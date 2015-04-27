'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admins = require('../../app/controllers/admins.server.controller');

	app.route('/changeRole')
		.post(users.requiresLogin, admins.changeRole);

	app.route('/pushAccess')
		.post(users.requiresLogin, admins.pushAccess);

	app.route('/popAccess')
		.post(users.requiresLogin, admins.popAccess);

	app.route('/allUsers')
		.get(users.requiresLogin, admins.users);

	// Finish by binding the Admin middleware
	app.param('adminId', admins.adminByID);
};
