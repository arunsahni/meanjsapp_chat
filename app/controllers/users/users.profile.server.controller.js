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
	fs = require('fs'),
	aws = require('aws-sdk'),
    AWS_ACCESS_KEY = 'AKIAJGHRJFHBQUZJEJWQ',
 	AWS_SECRET_KEY = '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',
 	S3_BUCKET = 'sumacrm/avatars';

exports.getSignedURL = function (req, res) {
	aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
	var s3 = new aws.S3();
	var fileName = req.user.id;
	var s3_params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: req.query.s3_object_type,
		ACL: 'public-read'
	};
	s3.getSignedUrl('putObject', s3_params, function(err, data){
		if(err){
			console.log(err);
		}
		else{
			var return_data = {
				signed_request: data,
				//url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+'Arun'
				url: 'https://s3.amazonaws.com/sumacrm/avatars/' + fileName
			};
			res.write(JSON.stringify(return_data));
			res.end();
		}
	});
};



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
		var destPath = 'public/imgs/profileImg/' + fileName;

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
