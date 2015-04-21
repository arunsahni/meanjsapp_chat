'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Companyfeed Schema
 */
var CompanyfeedSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Companyfeed name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	likers:[{
		type: Schema.ObjectId,
		ref: 'User'
	}],
	comment:[{
		commenteduser: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		comment: { type: String },
		commentLiker: [{
			type: Schema.ObjectId,
			ref: 'User'
		}]
	}]
});

mongoose.model('Companyfeed', CompanyfeedSchema);
