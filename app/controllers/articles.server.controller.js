'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
	_ = require('lodash');

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;

	/* Bulk Data Script - Should be remove in future commit*/
	/*for(var i = 0;i <= 500; i++) {
		var articleloop = new Article(req.body);
		articleloop.title = 'Pankaj-'+i;
		articleloop.content = 'Dewangan ' +i;
		articleloop.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				console.log('Saved Data '+articleloop.title);
			}
		});
	}*/

	article.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
	res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
	var conditions = {_id: req.body._id},
		update = {
			title: req.body.title,
			content: req.body.content
		};
	Article.findOneAndUpdate(conditions, update, function (err, article){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		res.json(article);
	});

	/*This is another way to update the record*/
	/*Article.findOne({ _id: req.body._id }, function (err, article) {
		article.title = req.body.title;
		article.content = req.body.content;
		article.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(article);
			}
		});
	});*/
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
	var article = new Article(req.body);

	article.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(article);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next) {

	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send({
			message: 'Article is invalid'
		});
	}

	Article.findById(req.params.id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) {
			return res.status(404).send({
				message: 'Article not found'
			});
		}
		res.json(article);
	});
};

/**
 * Article authorization middleware
 */
/*This should be remove and place somewhere in the middle layer as midleware*/
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
