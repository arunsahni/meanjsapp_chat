/**
 * Created by sumasoft on 4/7/15.
 */
'use strict';

//Pusher service used for communicating with the articles REST endpoints
angular.module('core').factory('PusherService', ['$pusher' ,
    function($pusher){
        var PusherService = {};
        //We will move this key into somewhere else, may be in Enum file later - Pankaj
        var client = new Pusher('f9ee22d1cb0b7cc349e6');
        var pusher = $pusher(client);
        PusherService.listen = function (ChannelName, eventName, callback) {
            pusher.subscribe(ChannelName).bind(eventName, function(data) {
                callback(null, data);
            });
        };
        return PusherService;
    }

]);
