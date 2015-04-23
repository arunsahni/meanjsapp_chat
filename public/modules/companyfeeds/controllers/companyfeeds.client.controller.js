'use strict';

// Companyfeeds controller
angular.module('companyfeeds').controller('CompanyfeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companyfeeds','$modal',
	function($scope, $stateParams, $location, Authentication, Companyfeeds, $modal) {
		$scope.authentication = Authentication;
		var modalInstance;
		// Create new Companyfeed
		$scope.imgPath = Authentication.user._id + '.png';
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.imgPathOwn = 'https://s3.amazonaws.com/sumacrm/avatars/';

		$scope.create = function () {
			Companyfeeds.savecompanyfeed({
				name: this.name
			}).success(function (data) {
				delete $scope.name;
				$scope.companyfeeds = data;
			});
		};
        $scope.autoCompleteData = {
            EntityName: ['User'],
            Projection: ['firstName', '_id', 'isImage'],
            MatchField: 'firstName'
        };
		$scope.likersName = function(likerArray) {
            var i, len;
			$scope.LikerNameArray = likerArray;
            $scope.LikerName = '';
			for(i = 0, len = likerArray.length; i < len; i++) {
				$scope.LikerName = $scope.LikerName + '\n' + likerArray[i].user_name;
			}
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
        $scope.isLiked = function (likers) {
            var i, len;
            for (i = 0, len = likers.length; i < len; i += 1) {
                if (likers[i].user_id === Authentication.user._id) {
                    return true;
                }
            }
            return false;
        };

		$scope.addLiker = function (index) {
            $scope.myFlag = true;
            if (!$scope.companyfeeds[index].likers.length || !$scope.isLiked($scope.companyfeeds[index].likers)) {
                Companyfeeds.addLiker({
                    compnayfeedId: $scope.companyfeeds[index]._id,
                    liker : {
                        user_id: Authentication.user._id,
                        user_name:Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;

                });
            } else {
                Companyfeeds.removeLiker({
                    compnayfeedId: $scope.companyfeeds[index]._id,
                    liker : {
                        user_id: Authentication.user._id,
                        user_name:Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;
                });
            }
		};

		$scope.addCommentLike = function (feedIndex, commentIndex) {
            $scope.myFlag = true;
            if (!$scope.companyfeeds[feedIndex].comment.length || !$scope.isLiked($scope.companyfeeds[feedIndex].comment[commentIndex].commentLiker)) {
                Companyfeeds.addCommentLike({
                    compnayfeedId: $scope.companyfeeds[feedIndex]._id,
                    commentId: $scope.companyfeeds[feedIndex].comment[commentIndex]._id,
                    commentLiker: {
                        user_id: Authentication.user._id,
                        user_name: Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;
                });
            } else {
                Companyfeeds.removeCommentLike({
                    compnayfeedId: $scope.companyfeeds[feedIndex]._id,
                    commentId: $scope.companyfeeds[feedIndex].comment[commentIndex]._id,
                    commentLiker: {
                        user_id: Authentication.user._id,
                        user_name: Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;
                });
            }
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

		$scope.show_name = 'grp.smor';
		$scope.show_name_less = 'grp.sles';
		$scope.page_size = '';
		$scope.paginationLimit = function(index) {
			$scope.Buttonshow_size = $scope.companyfeeds[index].pagesShown;
			$scope.companyfeeds[index].pagesShown =
				$scope.companyfeeds[index].pagesShown ? $scope.companyfeeds[index].pagesShown : 1;
			return 3 * $scope.companyfeeds[index].pagesShown;
		};
		$scope.hasMoreItemsToShow = function(index) {
			if($scope.page_size === 1 || $scope.page_size ==='') {
				return $scope.companyfeeds[index].pagesShown < ($scope.companyfeeds[index].comment.length / 3);
			}
		};
		$scope.showMoreItems = function(index) {
			$scope.companyfeeds[index].pagesShown = $scope.companyfeeds[index].pagesShown + 1;
		};

		$scope.showMoreItemsLess = function(index) {
			$scope.companyfeeds[index].pagesShown = $scope.companyfeeds[index].pagesShown - 1;
			$scope.page_size = $scope.companyfeeds[index].pagesShown;
		};
		$scope.showliker = function() {
			modalInstance = $modal.open({
				templateUrl: 'modules/companyfeeds/views/show-liker.client.view.html',
				scope: $scope,
				size: 'sm',
				resolve: {
					LikerNameArray: function () {
						return $scope.LikerNameArray;
					}
				}
			});
			modalInstance.result.then(function () {
			}, function () {
				//console.log('Modal dismissed at: ' + new Date());
			});
		};
	}
]);
