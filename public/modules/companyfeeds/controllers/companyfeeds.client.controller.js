'use strict';

// Companyfeeds controller
angular.module('companyfeeds').controller('CompanyfeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companyfeeds',
	function($scope, $stateParams, $location, Authentication, Companyfeeds) {
		$scope.authentication = Authentication;

		// Create new Companyfeed
		$scope.imgPath = Authentication.user._id + '.png';
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.create = function() {
			// Create new Companyfeed object
			var companyfeed = new Companyfeeds ({
				name: this.name
			});

			// Redirect after save
			companyfeed.$save(function(response) {
				$location.path('companyfeeds/create');
				location.reload();
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Companyfeed
		$scope.remove = function(companyfeed) {
			if ( companyfeed ) { 
				companyfeed.$remove();

				for (var i in $scope.companyfeeds) {
					if ($scope.companyfeeds [i] === companyfeed) {
						$scope.companyfeeds.splice(i, 1);
					}
				}
			} else {
				$scope.companyfeed.$remove(function() {
					$location.path('companyfeeds');
				});
			}
		};

		// Update existing Companyfeed
		$scope.update = function() {
			var companyfeed = $scope.companyfeed;

			companyfeed.$update(function() {
				$location.path('companyfeeds/' + companyfeed._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Companyfeeds
		$scope.find = function() {
			$scope.companyfeeds = Companyfeeds.query();
		};

		// Find existing Companyfeed
		$scope.findOne = function() {
			$scope.companyfeed = Companyfeeds.get({ 
				companyfeedId: $stateParams.companyfeedId
			});
		};
	}
]);
