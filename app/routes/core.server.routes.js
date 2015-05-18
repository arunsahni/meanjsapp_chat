'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
	app.route('/chat/chatSave').post(core.chatSave);
	app.route('/chats').get(core.chatFind);
};
