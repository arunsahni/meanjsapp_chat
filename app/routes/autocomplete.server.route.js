'use strict';

/**
* Module dependencies.
*/
var autoComplete = require('../../app/controllers/autocomplete.server.controller');

module.exports = function(app) {
    app.post('/autoComplete/getAutoCompleteData', function(req, res) {
        autoComplete.customQuery(req, res);
    });
};
