// in the top-level module of the app
angular.module('core').factory('mySocket', function (socketFactory) {
    return socketFactory();
});
