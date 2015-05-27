'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);
	app.route('/chat/chatSave').post(core.chatSave);
	app.route('/chats').get(core.chatFind);
	app.route('/onlineUsers').get(core.onlineUsers);
	app.route('/chat/privateChatSave').post(core.privateChatSave);
	app.route('/chats/private/:reciverId').get(core.privatchatFind);
};
