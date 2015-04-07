'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'toastr',
	function($scope, $http, $location, Authentication, toastr) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/dashboard');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				toastr.info('You have signed up', 'Successfully');
				// And redirect to the index page
				$location.path('/dashboard');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/dashboard');
                toastr.success('You are successfully logged in.', 'done')
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
