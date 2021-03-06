'use strict';



//Setting up route
angular.module('admins').config(['$stateProvider',
	function($stateProvider) {

		var checkRole = function($q, $timeout, $location, Authentication) {
			// Initialize a new promise
			var deferred = $q.defer();
			var authentication = Authentication.user.roles[0];
			if (authentication === 'admin' || authentication === 'superadmin')
				$timeout(deferred.resolve);
			else {
					$timeout(deferred.reject);
					$location.url('/dashboard');
				}
			return deferred.promise;
		};

		// Admins state routing
		$stateProvider.
			state('userlist', {
			url: '/userlist',
			templateUrl: 'modules/admins/views/userList.html',
			resolve: {
				checkRole: checkRole
			}
			}).
			state('featuresAccess', {
				url: '/featuresAccess',
				templateUrl: 'modules/admins/views/featuresAccess.html',
				resolve: {
					checkRole: checkRole
				}
			});
	}
]);
