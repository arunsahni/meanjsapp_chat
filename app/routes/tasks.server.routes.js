'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tasks = require('../../app/controllers/tasks.server.controller');

	// Tasks Routes

	app.post('/tasks/create', function(req, res) {
		tasks.create(req, res);
	});

	app.post('/tasks/updateMilestone', function(req, res) {
		tasks.updateMilestone(req, res);
	});

	app.get('/tasks', function(req, res) {
		tasks.list(req, res);
	});
	app.post('/task/update', function(req, res) {
		tasks.update(req, res);
	});
	app.get('/task/:id', function(req, res) {
		tasks.taskByID(req, res);
	});
    app.get('/tasks/myTask', function(req, res) {
		tasks.taskByUserId(req, res);
	});
	app.get('/task/deleteAssignee/:taskId/:assigneeId', function(req, res) {
		tasks.updateAssigneesList(req, res);
	});
};
