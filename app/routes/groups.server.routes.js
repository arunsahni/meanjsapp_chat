'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var groups = require('../../app/controllers/groups.server.controller');


    app.post('/group/save', function(req, res) {
        groups.create(req, res);
    });

    app.get('/groups', function(req, res) {
        groups.list(req, res);
    });


    app.get('/group/:id', function(req, res) {
        groups.groupByID(req, res);
    });

    app.post('/group/update', function(req, res) {
        groups.update(req, res);
    });

    app.post('/group/delete', function(req, res) {
        groups.delete(req, res);
    });
    app.route('/sign_s3').get(groups.getSignedURL);
};
