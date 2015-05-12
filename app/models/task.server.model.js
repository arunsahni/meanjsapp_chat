'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Task name',
		trim: true
	},
	createdDate: {
		type: Date,
		default: Date.now
	},
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'New'
    },
    priority: {
        type: String,
        default: ''
    },
    assignees: [{
        id: {
            type: Schema.ObjectId,
            ref: 'User',
            required: 'Please fill assignee',
        },
        milestone: {
            type: Number,
            default: 0
        }
    }],
    deadline: {
        type: Date,
        required: 'Please fill dead line date'
    },
	createdBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    group: {
        type: Schema.ObjectId,
        ref: 'Group'
    }
});

mongoose.model('Task', TaskSchema);
