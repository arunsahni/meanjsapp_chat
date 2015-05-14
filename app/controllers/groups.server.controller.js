'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Group = mongoose.model('Group'),
	_ = require('lodash'),
	fs = require('fs'),
	aws = require('aws-sdk'),
	AWS_ACCESS_KEY = 'AKIAJGHRJFHBQUZJEJWQ',
	AWS_SECRET_KEY = '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',
	S3_BUCKET = 'sumacrm/groups';

/**
 * Create a Group
 */
exports.create = function(req, res) {
	var group = new Group(req.body);
	group.user = req.user;

	group.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

exports.getSignedURL = function (req, res) {
	aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
	var s3 = new aws.S3();
	var fileName = req.user.group.id;
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
				url: 'https://s3.amazonaws.com/sumacrm/groups/' + fileName
			};
			res.write(JSON.stringify(return_data));
			res.end();
		}
	});
};



/**
 * Show the current Group
 */
exports.read = function(req, res) {
	res.jsonp(req.group);
};

/**
 * Update a Group
 */
exports.update = function(req, res) {
    var conditions = {_id: req.body._id},
        update = {
            name: req.body.name,
			isImage: req.body.isImage
        };
    Group.findOneAndUpdate(conditions, update, function (err, group){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(group);
    });
};

/**
 * Delete an Group
 */
exports.delete = function(req, res) {
	var group = new Group(req.body);

	group.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(group);
		}
	});
};

/**
 * List of Groups
 */
exports.list = function(req, res) { 
	Group.find().sort('-created').populate('createdBy', 'displayName').exec(function(err, groups) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(groups);
		}
	});
};

/**
 * Group middleware
 */
exports.groupByID = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            message: 'Group is invalid'
        });
    }

	Group.findById(req.params.id).populate('createdBy', 'displayName').exec(function(err, group) {
		if (err) return next(err);
		if (! group) return next(new Error('Failed to load Group '));
		res.json(group);
	});
};

/**
 * Group authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.group.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
