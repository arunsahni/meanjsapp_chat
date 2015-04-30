'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Companyfeed = mongoose.model('Companyfeed'),
	User = mongoose.model('User'),
	_ = require('lodash');
var pusherService = require('../core/pusher');

/**
 * Create a Companyfeed
 */
exports.create = function(req, res) {
	var companyfeed = new Companyfeed(req.body);
	companyfeed.user = req.user;
	companyfeed.group = req.user.group;
	companyfeed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Companyfeed.find({group: req.user.group}).sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					var BellNotification = {
						userData: req.user,
						message: req.user.displayName+' add new post on ' + companyfeed.name,
						notificationtype: 'Post',
						companyfeedId : req.body.compnayfeedId
					};
					User.findOneAndUpdate({group: req.user.group},{$push : {bellnotification: BellNotification}}, {multi: true}).exec(function(err, data){
						if(err) {
							return res.status(500).json({
								error: 'Cannot add the bid'
							});
						}else{
							console.log('Here in Like');
						}
					});
					pusherService.pusherGenerate('Channel-Public', 'Post-AddEvent', {'message': req.user.displayName+' add new post on ' + companyfeed.name,'userData':req.user,'data': companyfeed});
					res.jsonp(companyfeeds);
				}
			});
		}
	});
};

/**
 * Show the current Companyfeed
 */
exports.read = function(req, res) {
	res.jsonp(req.companyfeed);
};

/**
 * Update a Companyfeed
 */
exports.update = function(req, res) {
	var companyfeed = req.companyfeed ;

	companyfeed = _.extend(companyfeed , req.body);

	companyfeed.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(companyfeed);
		}
	});
};

/**
 * Delete an Companyfeed
 */
exports.delete = function(req, res) {
	var companyfeed = req.companyfeed ;

	companyfeed.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(companyfeed);
		}
	});
};

/**
 * List of Companyfeeds
 */
exports.list = function(req, res) { 
	Companyfeed.find({group: req.user.group}).sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			res.jsonp(companyfeeds);
		}
	});
};

/**
 * Companyfeed middleware
 */
exports.companyfeedByID = function(req, res, next, id) { 
	Companyfeed.findById(id).populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeed) {
		if (err) return next(err);
		if (! companyfeed) return next(new Error('Failed to load Companyfeed ' + id));
		req.companyfeed = companyfeed ;
		next();
	});
};

/**
 * Companyfeed authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.companyfeed.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.addComment = function(req,res){
	Companyfeed.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.compnayfeedId)},{$push:{ comment : req.body.comment}}).populate('user likers comment.commentLiker comment.commenteduser').exec(function(err,data) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot add the bid'
			});
		} else {
			var BellNotification = {
				userData: req.user,
				message: req.user.displayName+' commented on Post ' + data.name,
				notificationtype: 'Comment',
				companyfeedId : req.body.compnayfeedId
			};
			User.findOneAndUpdate({group: req.user.group},{$push : {bellnotification: BellNotification}}, {multi: true}).exec(function(err, data){
				if(err) {
					return res.status(500).json({
						error: 'Cannot add the bid'
					});
				}else{
					console.log('Here in Like');
					//pusherService.pusherGenerate('Channel-Public', 'Post-LikeEvent', {'message': req.user.displayName+' like post ' + data.name,'userData':req.user,'data': data});
				}
			});
			Companyfeed.find().sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					pusherService.pusherGenerate('Channel-Public', 'Commnet-AddEvent', {'message': req.user.displayName+' commented on Post ' + data.name,'userData':req.user,'data': data});
					res.jsonp(companyfeeds);
				}
			});
		}
	});
};

exports.addLikers = function(req, res){

	Companyfeed.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.compnayfeedId)}, {$push : {likers: req.user}}).populate('user likers comment.commentLiker comment.commenteduser').exec(function(err,data) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot add the bid'
			});
		} else {
			var BellNotification = {
				userData: req.user,
				message: req.user.displayName+' like post ' + data.name,
				notificationtype: 'like',
				companyfeedId : req.body.compnayfeedId
			};
			User.findOneAndUpdate({group: req.user.group},{$push : {bellnotification: BellNotification}}, {multi: true}).exec(function(err, data){
				if(err) {
					return res.status(500).json({
						error: 'Cannot add the bid'
					});
				}else{
					console.log('Here in comment');

				}
			});
			Companyfeed.find().sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					pusherService.pusherGenerate('Channel-Public', 'Post-LikeEvent', {'message': req.user.displayName+' like post ' + data.name,'userData':req.user,'data': data});
					res.jsonp(companyfeeds);
				}
			});
		}
	});
};

exports.removeLiker = function(req, res){
    Companyfeed.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.compnayfeedId)}, {$pop: {likers: req.user}}).populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, data) {
        if (err) {
            return res.status(500).json({
                error: 'Cannot add the bid'
            });
        } else {
            Companyfeed.find().sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
					pusherService.pusherGenerate('Channel-Public', 'Post-UnLikeEvent', {'message': req.user.displayName+' unliked post ' + data.name,'userData':req.user,'data': data});
                    res.jsonp(companyfeeds);
                }
            });
        }
    });
};

exports.addCommentLike = function(req, res) {
	Companyfeed.findOneAndUpdate(({_id: mongoose.Types.ObjectId(req.body.compnayfeedId)},{'comment._id' : mongoose.Types.ObjectId(req.body.commentId)}), {$push : {'comment.$.commentLiker': req.user}}).populate('user likers comment.commentLiker comment.commenteduser').exec(function (err, data) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot add the bid'
			});
		} else {
			var BellNotification = {
				userData: req.user,
				message: req.user.displayName +' Liked comment ' + req.body.comment,
				notificationtype: 'CommentLike',
				companyfeedId : req.body.compnayfeedId
			};
			User.findOneAndUpdate({group: req.user.group},{$push : {bellnotification: BellNotification}}, {multi: true}).exec(function(err, data){
				if(err) {
					return res.status(500).json({
						error: 'Cannot add the bid'
					});
				}else{
					console.log('Here in commentLike');
					//pusherService.pusherGenerate('Channel-Public', 'Post-LikeEvent', {'message': req.user.displayName+' like post ' + data.name,'userData':req.user,'data': data});
				}
			});
			Companyfeed.find().sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					pusherService.pusherGenerate('Channel-Public', 'Commnet-LikeEvent', { message: req.user.displayName +' Liked comment ' + req.body.comment,'userData':req.user,'data': data});
					res.jsonp(companyfeeds);
				}
			});
		}
	});
};

exports.removeCommentLike = function(req, res) {
	Companyfeed.findOneAndUpdate(({_id: mongoose.Types.ObjectId(req.body.compnayfeedId)}, {'comment._id' : mongoose.Types.ObjectId(req.body.commentId)}), {$pop : {'comment.$.commentLiker': req.body.commentLiker}}).populate('user likers comment.commentLiker comment.commenteduser').exec(function (err, data) {
		if (err) {
			return res.status(500).json({
				error: 'Cannot add the bid'
			});
		} else {
			Companyfeed.find().sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, companyfeeds) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					pusherService.pusherGenerate('Channel-Public', 'Commnet-UnLikeEvent',{message : req.user.displayName+ 'Unliked Comment ' + req.body.comment,'userData':req.user,'data': data});
					res.jsonp(companyfeeds);
				}
			});
		}
	});
};

exports.getcompanyfeedByUserId = function (req, res) {
    Companyfeed.find({user: {$in: req.body.userIds}, group: req.user.group}).sort('-created').populate('user likers comment.commentLiker comment.commenteduser').exec(function(err, feeds) {
        if (err) {
            return res.status(500).json({
                error: 'Can not get the feeds of selected user.'
            });
        } else {
            res.jsonp(feeds);
        }
    });
};

