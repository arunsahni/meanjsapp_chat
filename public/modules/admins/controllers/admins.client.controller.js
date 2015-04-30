'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admins',
	function($scope, $stateParams, $location, Authentication, Admins) {
		$scope.authentication = Authentication;
		$scope.userList = [];
		$scope.isActive = true;

		$scope.currentPage = 1;
		$scope.maxSize = 2;
		$scope.itemsPerPage = 10;

		// For User list
		$scope.findUserList = function() {
			Admins.userList().success(function(response) {
				angular.forEach(response, function(val){
					if($scope.authentication.user._id !== val._id){
						$scope.userList.push(val);
					}

				});
				$scope.totalItems = $scope.userList.length;
				$scope.currentPage = 1;
				$scope.maxSize = 2;
				$scope.itemsPerPage = 10;
				$scope.numofPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
				console.log('Item per page',$scope.numofPages);
				console.log('total items',$scope.totalItems);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//$scope.$watch('currentPage + numPerPage', function () {
        //
        //
		//});
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

angular.module('admins').filter('offset', function() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
});
