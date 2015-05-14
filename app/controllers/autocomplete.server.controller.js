'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    _ = require('lodash');

exports.customQuery = function(req, res) {
    var EntityName = mongoose.model(req.body.EntityName[0]),
        projectionArray = req.body.Projection,
        MatchField =  req.body.MatchField || null,
        aggregateField = {},
        projection = {},
        skip = req.body.skip || 0,
        take = req.body.take || 10,
        i, len;

        if (MatchField) {
            aggregateField[MatchField] = {$regex: req.body.SearchText, $options: 'i'};
        }

        for(i = 0, len = projectionArray.length; i < len; i += 1) {
            projection[projectionArray[i]] = 1;
        }
        EntityName.aggregate([
            {$match: aggregateField},
            {$match: {group: req.user.group._id}},
            {$project: projection},
            {$skip : skip },
            {$limit : take }
        ],function (err, articles) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                res.json(articles);
        });
};
