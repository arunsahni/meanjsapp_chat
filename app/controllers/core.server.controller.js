'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Chat = mongoose.model('Chat'),
	User = mongoose.model('User');
/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.chatSave = function(req,res) {
	var chat = new Chat(req.body);
	chat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chat);
		}
	});
};

exports.onlineUsers = function(req, res){
	User.find({status:'online'},{displayName: 1,isImage: 1,status: 1}).exec(function (err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(users);
		}
	});


};

exports.chatFind = function(req, res){
	Chat.find({}).sort({'chatDate':-1}).limit(10).populate('sender reciever').exec(function (err, chats) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(chats.reverse());
		}
	});
};

