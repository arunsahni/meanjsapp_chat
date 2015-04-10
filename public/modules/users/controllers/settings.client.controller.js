'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'toastr', '$upload',
	function($scope, $http, $location, Users, Authentication, toastr, $upload) {
		$scope.user = Authentication.user;
        $scope.uploadedImage = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;

		var executeOnSignedUrl = function(file, callback) {
			var this_s3upload, xhr;
			this_s3upload = this;
			xhr = new XMLHttpRequest();
			xhr.open('GET', '/sign_s3' + '?s3_object_type=' + file.type + '&s3_object_name=' + 'default_name', true);
			xhr.overrideMimeType('text/plain; charset=x-user-defined');
			xhr.onreadystatechange = function(e) {
				var result;
				if (this.readyState === 4 && this.status === 200) {
					try {
						result = JSON.parse(this.responseText);
					} catch (error) {
						this_s3upload.onError('Signing server returned some ugly/empty JSON: "' + this.responseText + '"');
						return false;
					}
					return callback(result.signed_request, result.url);
				} else if (this.readyState === 4 && this.status !== 200) {
					return this_s3upload.onError('Could not contact request signing server. Status = ' + this.status);
				}
			};
			return xhr.send();
		};

		var createCORSRequest = function(method, url) {
			var xhr;
			xhr = new XMLHttpRequest();
			if (xhr.withCredentials !== null) {
				xhr.open(method, url, true);
			} else if (typeof XDomainRequest !== 'undefined') {
				xhr = new XDomainRequest();
				xhr.open(method, url);
			} else {
				xhr = null;
			}
			return xhr;
		};

		var uploadToS3 = function(file, url, public_url) {
			var this_s3upload, xhr;
			this_s3upload = this;
			xhr = createCORSRequest('PUT', url);
			if (!xhr) {
				this.onError('CORS not supported');
			} else {
				xhr.onload = function() {
					if (xhr.status === 200) {
						//this_s3upload.onProgress(100, 'Upload completed.');
						//return this_s3upload.onFinishS3Put(public_url);
						$scope.uploadedImage = public_url;
						toastr.success("File Uploaded Succsessfully");
						$scope.$apply();
						window.location.reload();
						//$location.path('/settings/profile');
					} else {
						console.log('Upload error: ' + xhr.status);
						//return this_s3upload.onError('Upload error: ' + xhr.status);
					}
				};
				xhr.onerror = function() {
					return this_s3upload.onError('XHR error.');
				};
				xhr.upload.onprogress = function(e) {
					var percentLoaded;
					if (e.lengthComputable) {
						percentLoaded = Math.round((e.loaded / e.total) * 100);
						$scope.uploadProgress = percentLoaded;
						$scope.$apply();
						//return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
					}
				};
			}
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.setRequestHeader('x-amz-acl', 'public-read');
			return xhr.send(file);
		};

		var uploadFile = function(file) {
			return executeOnSignedUrl(file, function(signedURL, publicURL) {
				return uploadToS3(file, signedURL, publicURL);
			});
		};


		$scope.onFileSelect = function(image) {
			if (image.length) {
				if (angular.isArray(image)) {
					image = image[0];
				}
				if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
					alert('Only PNG and JPEG are accepted.');
					return;
				}
				$scope.uploadInProgress = true;
				$scope.uploadProgress = 0;

				$scope.test = uploadFile(image);

				/*$scope.upload = $upload.upload({
					url: '/upload/image',
					method: 'POST',
					file: image
				}).progress(function (event) {
					$scope.uploadProgress = Math.floor(event.loaded / event.total);
				}).success(function (data, status, headers, config) {
					$scope.uploadInProgress = false;
					$scope.uploadedImage = $scope.user._id + '.png';
				}).error(function (err) {
					$scope.uploadInProgress = false;
					console.log('Error uploading file: ' + err.message || err);
				});*/
			}
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
				if($scope.uploadedImage){
					$scope.user.isImage = true;
				}
				var user = new Users($scope.user);
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
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
