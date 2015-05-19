'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Group name',
		trim: true
	},
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    groupAdmin: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    isImage: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date
    }
});

mongoose.model('Group', GroupSchema);
