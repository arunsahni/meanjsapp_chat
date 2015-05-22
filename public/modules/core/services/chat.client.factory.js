'use strict';
// in the top-level module of the app
angular.module('core').factory('mySocket', function (socketFactory) {
    return socketFactory();
});

angular.module('core').factory('Chats', [ '$http' , function ($http) {
    var chatService = {};

    chatService.saveMessageData = function(req,res){
        return $http.post('/chat/chatSave', req);
    };
    chatService.getMessageData = function(req,res){
        return $http.get('/chats');
    };
    chatService.getUserList = function(req, res) {
        return $http.get('/onlineUsers');
    };

    return chatService;
}]);
