'use strict';

angular.module('core').factory('AutoComplete', ['$http',
    function($http) {
        var AutoCompleteService = {};

        AutoCompleteService.getAutoCompleteData = function (req, res) {
            return $http.post('autoComplete/getAutoCompleteData', req);
        };

        return AutoCompleteService;
    }
]);
