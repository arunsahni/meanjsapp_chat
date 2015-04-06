'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'toastr',
	function($scope, Authentication, toastr) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
        toastr.info('Are you the 6 fingered man?')
	}
]);
