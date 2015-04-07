/**
 * Created by sumasoft on 4/7/15.
 */
'use strict';

//Pusher service used for communicating with the articles REST endpoints
angular.module('articles').factory('PusherService', ['$pusher' ,
    function($pusher){
        var PusherService={};
        var client = new Pusher('f9ee22d1cb0b7cc349e6');
        var pusher = $pusher(client);
        PusherService.channel = function (ChannelName, eventName, callback) {
            pusher.subscribe(ChannelName).bind(eventName, function(data) {
                callback(null, data);
            });
        };
         return PusherService;
    }

]);
