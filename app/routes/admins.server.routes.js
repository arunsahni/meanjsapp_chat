'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admins = require('../../app/controllers/admins.server.controller');

	// Admins Routes
	app.route('/admins')
		.get(admins.list)
		.post(users.requiresLogin, admins.create);

	app.route('/userlist')
		.get(admins.userList);

	app.route('/changeRole')
		.post(admins.changeRole);

	app.route('/allUsers')
		.get(admins.users);

	app.route('/admins/:adminId')
		.get(admins.read)
		.put(users.requiresLogin, admins.hasAuthorization, admins.update)
		.delete(users.requiresLogin, admins.hasAuthorization, admins.delete);

	// Finish by binding the Admin middleware
	app.param('adminId', admins.adminByID);
};
