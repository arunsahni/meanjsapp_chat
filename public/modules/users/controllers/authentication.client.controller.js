'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'toastr', 'Groups','mySocket',
	function($scope, $http, $location, Authentication, toastr, Groups, mySocket) {
		$scope.authentication = Authentication;
        $scope.credentials = {};
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/companyfeeds/create');

		$scope.signup = function() {
            $scope.credentials.group = $scope.credentials.group._id;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				toastr.info('You have signed up', 'Successfully');
				// And redirect to the index page
				$location.path('/companyfeeds/create');
			}).error(function(response) {
				$scope.error = response.message;
                $scope.credentials.group = $scope.groups[0];
			});
		};

        $scope.init = function() {
            Groups.getGroups().success(function(groups){
                $scope.groups = groups;
                $scope.credentials.group = $scope.groups[0];
            });
        };
        //$scope.defaultSelected = $scope.groups[0];
		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				var object = {};
				object.id = $scope.authentication.user._id;
				object.displayName = $scope.authentication.user.displayName;
				object.isImage = $scope.authentication.user.isImage;

				mySocket.emit('add user', object);
				// And redirect to the index page
				$location.path('/companyfeeds/create');
                toastr.success('You are successfully logged in.', 'done');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
