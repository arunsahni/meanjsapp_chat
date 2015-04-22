'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('groups').factory('Groups', ['$http',
    function($http) {
        var serviceFactory = {};

        serviceFactory.saveGroup = function (req,res) {
            return $http.post('/group/save', req);
        };

        serviceFactory.getGroups = function (req, res) {
            return $http.get('/groups');
        };

        serviceFactory.getGroupById = function (req, res) {
            return $http.get('group/' + req.groupId);
        };

        serviceFactory.updateGroup = function (req,res) {
            return $http.post('/group/update', req);
        };

        serviceFactory.deleteGroup = function (req, res) {
            return $http.post('/group/delete', req);
        };
        return serviceFactory;
    }
]);
