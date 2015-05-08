'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Article = mongoose.model('Article'),
	_ = require('lodash');
var pusherService = require('../core/pusher');

var paypal = require('paypal-rest-sdk');
var api = {
	'host' : 'api.sandbox.paypal.com',
	'port' : '',
	'client_id' : 'Ady11VmaVVGsWcoioR1-LKasKJpmTsw76hXkthUYRF_NK1Ie2isqVyr0jHil86zKoftRdHXOpabuqJBT',
	'client_secret' : 'EDlwPeSUZ-MPFaB2W-2HYSpgT2OivBVg3oG8yvJblJiLLbl4fnlqbWa7pOObQu9rnBTLqOWgJXPE_PE_'
};
paypal.configure(api);

/**
 * Create a article
 */
exports.create = function(req, res) {
	var article = new Article(req.body);
	article.user = req.user;
	article.group = req.user.group;

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
	Article.find({group: req.user.group}).sort('-created').populate('user').exec(function(err, articles) {
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

/*
* Pusher creating
* */
exports.generatePusher =function(req,res){
	pusherService.pusherGenerate('Pusher-channel', 'Pusher-event', {'message': 'Pusher Genetrated By - ' + req.user.displayName});
};

/*
*Pay Pal Implementation
*/
exports.PayPalcreate = function(req, res){
	var method = req.param('method');
	var payment = {
		'intent': 'sale',
		'payer': {
		},
		'transactions': [{
			'amount': {
				'currency': req.param('currency'),
				'total': req.param('amount')
			}
		}]
	};

	if (method === 'paypal') {
		payment.payer.payment_method = 'paypal';
		payment.redirect_urls = {
			'return_url': 'http://localhost:3000/#!/paypalexcute',
			'cancel_url': 'http://localhost:3000/#!/articles'
		};
	} else if (method === 'credit_card') {
		var funding_instruments = [
			{
				'credit_card': {
					//'type': req.param('type').toLowerCase(),
					//'number': req.param('number'),
					//'expire_month': req.param('expire_month'),
					//'expire_year': req.param('expire_year'),
					//'first_name': req.param('first_name'),
					//'last_name': req.param('last_name')
					'type': 'visa',
					'number': '4032039170553541',
					'expire_month': '05',
					'expire_year': '20',
					'first_name': 'parag',
					'last_name': 'waghela'
				}
			}
		];
		payment.payer.payment_method = 'credit_card';
		payment.payer.funding_instruments = funding_instruments;
	}
	paypal.payment.create(payment, function (error, payment) {
		if (error) {
			//console.log(error);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(error)
			});

		} else {
			req.session.paymentId = payment.id;
			res.json(payment);
		}
	});

};

/*
  Pay Pal Execution
 */
exports.execute = function(req, res){
	var paymentId = req.session.paymentId;
	var payerId = req.param('PayerID');
	var details = { 'payer_id': payerId };
	paypal.payment.execute(paymentId, details, function (error, payment) {
		if (error) {
			console.log(error);
		} else {
			console.log(payment);
			res.json(payment);
		}
	});
};

/*
 pay pal payment cancelation
 */
exports.cancel = function(req, res){
	//res.render('cancel');
};

