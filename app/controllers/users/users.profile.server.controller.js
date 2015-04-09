'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	multiparty = require('multiparty'),
	fs = require('fs');

exports.postImage = function(req, res) {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {

		var file = files.file[0];
		var contentType = file.headers['content-type'];
		var tmpPath = file.path;
		var extIndex = tmpPath.lastIndexOf('.');
		var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
		// uuid is for generating unique filenames.
		var fileName = req.user._id + '.png';
		var destPath = 'images/profileImg/' + fileName;

		// Server side file type checker.
		if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
			fs.unlink(tmpPath);
			return res.status(400).send('Unsupported file type.');
		}

		fs.rename(tmpPath, destPath, function(err) {
			if (err) {
				return res.status(400).send('Image is not saved:');
			}
			return res.json(destPath);
		});
	});
};

exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
