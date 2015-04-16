'use strict';

// Companyfeeds controller
angular.module('companyfeeds').controller('CompanyfeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companyfeeds',
	function($scope, $stateParams, $location, Authentication, Companyfeeds) {
		$scope.authentication = Authentication;

		// Create new Companyfeed
		$scope.imgPath = Authentication.user._id + '.png';
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.imgPathOwn = 'https://s3.amazonaws.com/sumacrm/avatars/';

		$scope.create = function () {
			Companyfeeds.savecompanyfeed({
				name: this.name
			}).success(function (data) {
				$scope.companyfeeds = data;
			});
		};
        $scope.autoCompleteData = {
            EntityName: ['User'],
            Projection: ['firstName', '_id', 'isImage'],
            MatchField: 'firstName'
        };

		$scope.likersNmae = function(likerArray) {
			//$scope.LikerName=[];
			$scope.LikerName  =likerArray[0].user_name;
			for(var i = 1;i<likerArray.length;i++) {
				//$scope.LikerName.push(likerArray[i].user_name);
				$scope.LikerName=$scope.LikerName+'\n'+likerArray[i].user_name;
			}
			//console.log($scope.LikerName);
		};
		// Remove existing Companyfeed
		$scope.remove = function (companyfeed) {
			if (companyfeed) {
				companyfeed.$remove();

				for (var i in $scope.companyfeeds) {
					if ($scope.companyfeeds [i] === companyfeed) {
						$scope.companyfeeds.splice(i, 1);
					}
				}
			} else {
				$scope.companyfeed.$remove(function () {
					$location.path('companyfeeds');
				});
			}
		};

		// Find a list of Companyfeeds
		$scope.init = function () {
			Companyfeeds.getcompanyfeeds().success(function (companyfeeds) {
				$scope.companyfeeds = companyfeeds;
			});
		};

		// Find existing Companyfeed
		$scope.findOne = function () {
			Companyfeeds.getcompanyfeedById({
				companyfeedId: $stateParams.companyfeedId
			}).success(function (companyfeed) {
				$scope.companyfeed = companyfeed;
			});
		};

		$scope.addComment = function (companyfeedId) {
			Companyfeeds.addCommentService({
				compnayfeedId: companyfeedId,
				comment: {
					user_id: Authentication.user._id,
					user_name:Authentication.user.displayName,
					comment: this.comment
				}
			}).success(function (companyfeeds) {
				$scope.companyfeeds = companyfeeds;
			});
		};

		$scope.addLiker = function (companyfeedId) {
			Companyfeeds.addLiker({
				compnayfeedId: companyfeedId,
				liker : {
					user_id: Authentication.user._id,
					user_name:Authentication.user.displayName
				}
			}).success(function (companyfeeds) {
				$scope.companyfeeds = companyfeeds;

			});
		};

		$scope.addCommentLike = function (companyFeedId, commentId) {
			Companyfeeds.addCommentLike({
				compnayfeedId: companyFeedId,
				commentId: commentId,
				commentLiker: {
					user_id: Authentication.user._id,
					user_name:Authentication.user.displayName
				}
			}).success(function (companyfeeds) {
				$scope.companyfeeds = companyfeeds;
			});
		};

        function getCompanyFeedById (userIds) {
            Companyfeeds.getcompanyfeedByUserId({userIds: userIds}).success(function (companyFeeds) {
                $scope.companyfeeds = companyFeeds;
            });
        }

        $scope.$watchCollection('data.tags',function(val){
            if ($scope.data && $scope.data.tags.length) {
                var userIds = $scope.data.tags.map(function (user) {
                    return user._id;
                });
                getCompanyFeedById(userIds);
            }
            if ($scope.data && $scope.data.tags.length === 0) {
                $scope.init();
            }
        });
		$scope.show_name = 'show More';

		$scope.paginationLimit = function(index) {
			$scope.companyfeeds[index].pagesShown =
				$scope.companyfeeds[index].pagesShown ? $scope.companyfeeds[index].pagesShown : 1;
			return 3 * $scope.companyfeeds[index].pagesShown;
		};
		$scope.hasMoreItemsToShow = function(index) {
			return $scope.companyfeeds[index].pagesShown < ($scope.companyfeeds[index].comment.length / 3);
		};
		$scope.showMoreItems = function(index) {
			$scope.companyfeeds[index].pagesShown = $scope.companyfeeds[index].pagesShown + 1;
		};
	}
]);
