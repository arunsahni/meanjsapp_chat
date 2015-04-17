'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Companyfeed = mongoose.model('Companyfeed'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, companyfeed;

/**
 * Companyfeed routes tests
 */
describe('Companyfeed CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Companyfeed
		user.save(function() {
			companyfeed = {
				name: 'Companyfeed Name'
			};

			done();
		});
	});

	it('should be able to save Companyfeed instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Companyfeed
				agent.post('/companyfeeds')
					.send(companyfeed)
					.expect(200)
					.end(function(companyfeedSaveErr, companyfeedSaveRes) {
						// Handle Companyfeed save error
						if (companyfeedSaveErr) done(companyfeedSaveErr);

						// Get a list of Companyfeeds
						agent.get('/companyfeeds')
							.end(function(companyfeedsGetErr, companyfeedsGetRes) {
								// Handle Companyfeed save error
								if (companyfeedsGetErr) done(companyfeedsGetErr);

								// Get Companyfeeds list
								var companyfeeds = companyfeedsGetRes.body;

								// Set assertions
								(companyfeeds[0].user._id).should.equal(userId);
								(companyfeeds[0].name).should.match('Companyfeed Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Companyfeed instance if not logged in', function(done) {
		agent.post('/companyfeeds')
			.send(companyfeed)
			.expect(401)
			.end(function(companyfeedSaveErr, companyfeedSaveRes) {
				// Call the assertion callback
				done(companyfeedSaveErr);
			});
	});

	it('should not be able to save Companyfeed instance if no name is provided', function(done) {
		// Invalidate name field
		companyfeed.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Companyfeed
				agent.post('/companyfeeds')
					.send(companyfeed)
					.expect(400)
					.end(function(companyfeedSaveErr, companyfeedSaveRes) {
						// Set message assertion
						(companyfeedSaveRes.body.message).should.match('Please fill Companyfeed name');
						
						// Handle Companyfeed save error
						done(companyfeedSaveErr);
					});
			});
	});

	it('should be able to update Companyfeed instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Companyfeed
				agent.post('/companyfeeds')
					.send(companyfeed)
					.expect(200)
					.end(function(companyfeedSaveErr, companyfeedSaveRes) {
						// Handle Companyfeed save error
						if (companyfeedSaveErr) done(companyfeedSaveErr);

						// Update Companyfeed name
						companyfeed.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Companyfeed
						agent.put('/companyfeeds/' + companyfeedSaveRes.body._id)
							.send(companyfeed)
							.expect(200)
							.end(function(companyfeedUpdateErr, companyfeedUpdateRes) {
								// Handle Companyfeed update error
								if (companyfeedUpdateErr) done(companyfeedUpdateErr);

								// Set assertions
								(companyfeedUpdateRes.body._id).should.equal(companyfeedSaveRes.body._id);
								(companyfeedUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Companyfeeds if not signed in', function(done) {
		// Create new Companyfeed model instance
		var companyfeedObj = new Companyfeed(companyfeed);

		// Save the Companyfeed
		companyfeedObj.save(function() {
			// Request Companyfeeds
			request(app).get('/companyfeeds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Companyfeed if not signed in', function(done) {
		// Create new Companyfeed model instance
		var companyfeedObj = new Companyfeed(companyfeed);

		// Save the Companyfeed
		companyfeedObj.save(function() {
			request(app).get('/companyfeeds/' + companyfeedObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', companyfeed.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Companyfeed instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Companyfeed
				agent.post('/companyfeeds')
					.send(companyfeed)
					.expect(200)
					.end(function(companyfeedSaveErr, companyfeedSaveRes) {
						// Handle Companyfeed save error
						if (companyfeedSaveErr) done(companyfeedSaveErr);

						// Delete existing Companyfeed
						agent.delete('/companyfeeds/' + companyfeedSaveRes.body._id)
							.send(companyfeed)
							.expect(200)
							.end(function(companyfeedDeleteErr, companyfeedDeleteRes) {
								// Handle Companyfeed error error
								if (companyfeedDeleteErr) done(companyfeedDeleteErr);

								// Set assertions
								(companyfeedDeleteRes.body._id).should.equal(companyfeedSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Companyfeed instance if not signed in', function(done) {
		// Set Companyfeed user 
		companyfeed.user = user;

		// Create new Companyfeed model instance
		var companyfeedObj = new Companyfeed(companyfeed);

		// Save the Companyfeed
		companyfeedObj.save(function() {
			// Try deleting Companyfeed
			request(app).delete('/companyfeeds/' + companyfeedObj._id)
			.expect(401)
			.end(function(companyfeedDeleteErr, companyfeedDeleteRes) {
				// Set message assertion
				(companyfeedDeleteRes.body.message).should.match('User is not logged in');

				// Handle Companyfeed error error
				done(companyfeedDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Companyfeed.remove().exec();
		done();
	});
});