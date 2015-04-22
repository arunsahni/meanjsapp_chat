'use strict';

//Setting up route
angular.module('groups').config(['$stateProvider',
	function($stateProvider) {
		var isUserSuperAdmin = function($q, $timeout, $location, Authentication) {
			// Initialize a new promise
			var deferred = $q.defer();
			var authentication = Authentication.user.roles[0];
			console.log(authentication);
			if (authentication === 'superadmin')
				$timeout(deferred.resolve);
			else {
				$timeout(deferred.reject);
				$location.url('/dashboard');
			}
			return deferred.promise;
		};

		// Groups state routing
		$stateProvider.
		state('listGroups', {
			url: '/groups',
			templateUrl: 'modules/groups/views/list-groups.client.view.html',
			resolve: {
				checkRole: isUserSuperAdmin
			}
		}).
		state('createGroup', {
			url: '/groups/create',
			templateUrl: 'modules/groups/views/create-group.client.view.html',
			resolve: {
				checkRole: isUserSuperAdmin
			}
		}).
		state('viewGroup', {
			url: '/groups/:groupId',
			templateUrl: 'modules/groups/views/view-group.client.view.html',
			resolve: {
					checkRole: isUserSuperAdmin
				}
		}).
		state('editGroup', {
			url: '/groups/:groupId/edit',
			templateUrl: 'modules/groups/views/edit-group.client.view.html',
			resolve: {
				checkRole: isUserSuperAdmin
			}
		});
	}
]);
