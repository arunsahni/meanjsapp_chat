'use strict';

//Companyfeeds service used to communicate Companyfeeds REST endpoints
angular.module('companyfeeds').factory('Companyfeeds', ['$resource',
	function($resource) {
		return $resource('companyfeeds/:companyfeedId', { companyfeedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);