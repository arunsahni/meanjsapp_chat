'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Task = mongoose.model('Task'),
	_ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
	var task = new Task(req.body.data);
	task.createdBy = req.user;
	task.group = req.user.group;

	task.save(function(err, data) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
	res.jsonp(req.task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
	/*var task = req.task ;

	 task = _.extend(task , req.body);

	 task.save(function(err) {
	 if (err) {
	 return res.status(400).send({
	 message: errorHandler.getErrorMessage(err)
	 });
	 } else {
	 res.jsonp(task);
	 }
	 });
	 };*/
	var conditions = {_id: req.body._id},
		update = {
			name: req.body.name,
			discriptions: req.body.discriptions,
			priority: req.body.priority
		};
	Task.findOneAndUpdate(conditions, update, function (err, Task) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.json(Task);
	});
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
	var task = req.task ;

	task.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * List of Tasks
 */
exports.list = function(req, res) { 
	Task.find({group: req.user.group}).sort('-createdDate').populate('createdBy').exec(function(err, tasks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tasks);
		}
	});
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) { 
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send({
			message: 'Task is invalid'
		});
	}

	Task.findById(req.params.id).populate('createdBy assignees').exec(function(err, task) {
		if (err) return next(err);
		if (!task) {
			return res.status(404).send({
				message: 'Task not found'
			});
		}
		res.json(task);
	});
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.task.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
/*
*
* Remove Assingnee
*/

exports.updateAssigneesList = function(req, res) {
	//console.log(req.params);
	/*var conditions = {_id: req.params.taskId},
		update = {
		name: req.body.name,
		discriptions: req.body.discriptions,
		priority: req.body.priority
	};*/
	Task.findOneAndUpdate({_id: req.params.taskId}, {$pop : { 'assignees' : {_id : req.params.assigneeId}}}, function (err, Task) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else
			res.json(Task);
	});
};
