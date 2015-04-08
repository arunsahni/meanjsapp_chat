'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

var fs = require('fs'),
	mkdirOrig = fs.mkdir,
	directory = '../../images',
	osSep = '/';
/**
 * Update user details
 */

/*
* file upload start
*/

function rename(file, dest,filename, user, callback) {
	fs.rename(dest, directory  + filename, function(err) {
		if (err) throw err;
		else
			callback({
				success: true,
				file: {
					src: '/images' + dest + filename,
					name: filename,
					size: file.size,
					type: file.type,
					created: Date.now(),
					createor: (user) ? {
						id: user.id,
						name: user.name
					} : {}
				}
			});
	});
}

function mkdir_p(path, callback, position) {
	var parts = require('path').normalize(path).split(osSep);

	position = position || 0;

	if (position >= parts.length) {
		return callback();
	}

	var directory = parts.slice(0, position + 1).join(osSep) || osSep;
	fs.stat(directory, function(err) {
		if (err === null) {
			mkdir_p(path, callback, position + 1);
		} else {
			mkdirOrig(directory, function(err) {
				if (err && err.code !== 'EEXIST') {
					return callback(err);
				} else {
					mkdir_p(path, callback, position + 1);
				}
			});
		}
	});
}

exports.upload = function(req, res) {
	console.log(req.body);
	var dest = directory,
		file = req.body.files[0],
		path = dest;
	//console.log("Image Data",req.body);
	if(file.type == 'image/jpeg')
		var filename = req.user._id+".png";
	else
		var filename = req.body.files[0].name;
	if (!fs.existsSync(path)) {
		mkdir_p(path, function(err) {
			rename(file, dest, filename,req.user, function(data) {
				res.jsonp(data);
			});
		});
	} else {
		rename(file, dest,filename, req.user, function(data) {
			res.jsonp(data);
		})
	}
};
/*
*finish file upload
*
 */


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
