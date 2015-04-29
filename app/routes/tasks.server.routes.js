'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tasks = require('../../app/controllers/tasks.server.controller');

	// Tasks Routes

	app.post('/tasks/create', function(req, res) {
		tasks.create(req, res);
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



	//app.route('/tasks')
	//	.get(tasks.list)
	//	.post(users.requiresLogin, tasks.create);
    //
	//app.route('/tasks/:taskId')
	//	.get(tasks.read)
	//	.put(users.requiresLogin, tasks.hasAuthorization, tasks.update)
	//	.delete(users.requiresLogin, tasks.hasAuthorization, tasks.delete);
    //
	//// Finish by binding the Task middleware
	//app.param('taskId', tasks.taskByID);
};
