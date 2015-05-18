/**
 * Created by sumasoft on 5/18/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ChatSchema = new Schema({
    chatDate: {
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        default: '',
        trim: true
    },
    sender: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    reciever: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    chatType: {
        type: String
    }
});

mongoose.model('Chat', ChatSchema);

