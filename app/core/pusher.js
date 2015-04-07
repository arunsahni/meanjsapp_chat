/**
 * Created by sumasoft on 4/7/15.
 */
'use strict';

var Pusher = require('pusher');
//We will move the API key somewhere in Enum file - Pankaj
var pusher = new Pusher({
    appId: '114340',
    key: 'f9ee22d1cb0b7cc349e6',
    secret: '76fccf9f4cf77599cdd6'
});

exports.pusherGenerate= function (channelName, eventName, data) {
    pusher.trigger(channelName,eventName,data);
};
