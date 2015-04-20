'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Admin = mongoose.model('Admin'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Admin
 */
exports.create = function(req, res) {
	var admin = new Admin(req.body);
	admin.user = req.user;

	admin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Show the current Admin
 */
exports.read = function(req, res) {
	res.jsonp(req.admin);
};

exports.userList = function(req, res) {
	User.find({roles: { $in: ['user']}}, {displayName: 1, email:1, roles:1, isImage:1}).exec(function(err, users) {
		if (err) {
			return res.status(400).send({
			});
		} else {
			res.json(users);
		}
	});
};


/**
 * Update a Admin
 */
exports.update = function(req, res) {
	var admin = req.admin ;

	admin = _.extend(admin , req.body);

	admin.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};

/**
 * Delete an Admin
 */
exports.delete = function(req, res) {
	var admin = req.admin ;

	admin.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admin);
		}
	});
};
/**
 * List of all Admins
 */

exports.users = function(req, res) {
	User.find().sort('-created').populate('user', 'displayName').exec(function(err, admins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(admins);
		}
	});
};

/**
 * List of Admins
 */
exports.list = function(req, res) {
	Admin.find().sort('-created').populate('user', 'displayName').exec(function(err, admins) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(admins);
			res.jsonp(admins);
		}
	});
};

/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) { 
	Admin.findById(id).populate('user', 'displayName').exec(function(err, admin) {
		if (err) return next(err);
		if (! admin) return next(new Error('Failed to load Admin ' + id));
		req.admin = admin ;
		next();
	});
};

/**
 * Admin authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.admin.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * change Role
 */

exports.changeRole = function(req, res){
	User.findOneAndUpdate({_id: req.body.userId}, {$set : {roles: req.body.role}},function(err, user){
		if(err) return err.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
		else{
			res.jsonp(user);
		}
	});
};
