'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admins','AutoComplete',
	function($scope, $stateParams, $location, Authentication, Admins, AutoComplete) {
		$scope.authentication = Authentication;
		$scope.userList = [];
		$scope.isActive = true;

		$scope.currentPage = 1;
		$scope.maxSize = 2;
		$scope.itemsPerPage = 10;

		// For User list
		$scope.findUserList = function() {
			Admins.userCount().success(function(count) {
				$scope.totalItems = count;
				$scope.currentPage = 1;
				$scope.maxSize = 2;
				$scope.itemsPerPage = 10;
				$scope.numofPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);

				$scope.$watch('currentPage + numPerPage', function () {
					$scope.userList = [];
					var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);

					AutoComplete.getAutoCompleteData({
						EntityName: ['User'],
						Projection: ['displayName', '_id', 'isImage','roles','updated'],
						skip: begin,
						take: 10
					}).success(function (users1) {
						angular.forEach(users1, function(val){
							if($scope.authentication.user._id !== val._id){
								$scope.userList.push(val);
							}
						});
					});
				});
			});
		};

        $scope.roleChange = function(role, $index, user_id) {
            var userRole = {
                userId: user_id,
                role: role
            };
            Admins.updateUserRole(userRole).success(function(user) {
                $scope.userList[$index].roles[0] = user.roles[0];
            });
        };
	}
]);

