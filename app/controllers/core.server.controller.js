'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Chat = mongoose.model('Chat');
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
	console.log('Save chat message',req.body);
	var chat = new Chat(req.body);

	chat.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(chat);
			res.json(chat);
		}
	});
};

exports.chatFind = function(req,res){
	console.log('chat message show');
	Chat.find({}).skip(Chat.count() - 10).populate('sender reciever').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};
