'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

var usernames = [];
	//numUsers = 0;
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
var server = app.listen(config.port),


	io = require('socket.io')(server);

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
		msg.time = new Date();
		io.emit('chat message', msg);
	});

	socket.on('add user', function (username) {

		// add the client's username to the global list
		usernames.push(username);
		//++numUsers;
		console.log('User List',usernames);

		// echo globally (all clients) that a person has connected
		socket.emit('user joined', {
			usernames: usernames,
			numUsers: usernames.length
		});
	});

	socket.on('remove user', function(username){
		console.log('User to Remove', username);
		console.log('user Data', usernames);
		//var userToremove = [];
		usernames.forEach(function(user, key) {
			if(user.displayName === username){
				usernames.splice(key, 1);
			}
		});
		//userToremove.push(user.displayName);
		//var index = userToremove.indexOf(username);
		//if (index > -1) {
		//	usernames.splice(index, 1);
		//}
		//numUsers = numUsers - 1;

		console.log('Remainging user',usernames);
		socket.emit('user joined', {
			usernames: usernames,
			numUsers: usernames.length
		});
	});
	
	socket.on('typing', function(msg){
		io.emit('typing', msg);
	});

});

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
