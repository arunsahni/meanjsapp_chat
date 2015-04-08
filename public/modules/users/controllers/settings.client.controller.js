'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'toastr','$upload',
	function($scope, $http, $location, Users, Authentication, toastr, $upload) {

		$scope.user = Authentication.user;

		$scope.onFileSelect = function(image) {
			if (angular.isArray(image)) {
				image = image[0];
			}
			if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
				alert('Only PNG and JPEG are accepted.');
				return;
			}
			$scope.uploadInProgress = true;
			$scope.uploadProgress = 0;

			$scope.upload = $upload.upload({
				url: '/upload/image',
				method: 'POST',
				file: image
			}).progress(function(event) {
				$scope.uploadProgress = Math.floor(event.loaded / event.total);
			}).success(function(data, status, headers, config) {
				$scope.uploadInProgress = false;
				$scope.uploadedImage = $scope.user._id + '.png';
			}).error(function(err) {
				$scope.uploadInProgress = false;
				console.log('Error uploading file: ' + err.message || err);
			});
		};

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					toastr.success('Your Profile Updated Successfully ', 'Done');
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
				toastr.success('Your Password Change Successfully ', 'Done');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
