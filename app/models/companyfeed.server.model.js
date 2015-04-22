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
		user_id : {	type: String },
		user_name:{ type: String }
	}],
	comment:[{
		user_id : {	type: String },
		comment: { type: String },
		user_name:{ type: String },
		commentLiker: [{
			user_id : { type: String },
			user_name: { type: String }
		}]
	}],
    group: {
        type: Schema.ObjectId,
        ref: 'Group'
    }
});

mongoose.model('Companyfeed', CompanyfeedSchema);
