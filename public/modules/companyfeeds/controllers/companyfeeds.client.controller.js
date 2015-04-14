'use strict';

// Companyfeeds controller
angular.module('companyfeeds').controller('CompanyfeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companyfeeds',
	function($scope, $stateParams, $location, Authentication, Companyfeeds) {
		$scope.authentication = Authentication;

		// Create new Companyfeed
		$scope.imgPath = Authentication.user._id + '.png';
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.imgPathOwn = 'https://s3.amazonaws.com/sumacrm/avatars/';

		$scope.create = function() {
			Companyfeeds.savecompanyfeed({
				name: this.name
			}).success(function (data) {
				$scope.companyfeeds = data;
				find();
				/*toastr.success('Successfully', 'Article inserted');
				$scope.title = '';
				$scope.content = '';*/
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
		/*$scope.update = function() {
			var companyfeed = $scope.companyfeed;

			companyfeed.$update(function() {
				$location.path('companyfeeds/' + companyfeed._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
*/
		// Find a list of Companyfeeds
		$scope.find = function() {
			Companyfeeds.getcompanyfeeds().success(function(companyfeeds){
				$scope.companyfeeds = companyfeeds;
			});
		};
		// Find existing Companyfeed
		$scope.findOne = function() {
			Companyfeeds.getcompanyfeedById({
				companyfeedId: $stateParams.companyfeedId
			}).success(function (companyfeed) {
				$scope.companyfeed = companyfeed;
			});
		};
		$scope.addComment = function(companyfeedId){
			Companyfeeds.addCommentService({
				compnayfeedId : companyfeedId,
				comment : {
					user_id: Authentication.user._id,
					comment: this.comment
				}
			}).success(function(companyfeeds) {
				$scope.companyfeeds = companyfeeds;
			});
		};
		$scope.addLiker = function(companyfeedId, likerCount) {
			Companyfeeds.addLiker({
				compnayfeedId : companyfeedId,
				user_id: Authentication.user._id,
				likerCount: likerCount
			}).success(function(companyfeeds){
				$scope.companyfeeds = companyfeeds;

			});
		};
	}
]);
