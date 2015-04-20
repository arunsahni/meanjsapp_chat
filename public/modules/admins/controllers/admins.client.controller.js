'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admins',
	function($scope, $stateParams, $location, Authentication, Admins) {
		$scope.authentication = Authentication;
		$scope.isActive = true;

		// For User list
		$scope.findUserList = function() {
			Admins.userList().success(function(response) {
				$scope.userList = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.roleChange = function(role,$index,user_id) { 
			var userRole = {
				userId: user_id,
				role: role
			};
			Admins.updateUserRole(userRole).success(function(user){
				$scope.userList[$index].roles[0] = user.roles[0];
			});
		};
	}
]);
