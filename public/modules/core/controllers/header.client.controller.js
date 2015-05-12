'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus','toastr', 'PusherService','$translate','$location','$stateParams','$http',
	function($scope, $rootScope, Authentication, Menus, toastr, PusherService, $translate, $location, $stateParams, $http) {

		$scope.authentication = Authentication;

		$scope.isCollapsed = false;
		$scope.prepareMenu = function() {
			if ($scope.authentication.user !== '') {
				$scope.groupImage = 'https://s3.amazonaws.com/sumacrm/groups/' + Authentication.user.group._id;
				$rootScope.menu = Menus.getMenu('topbar');
			}
		};
		function getIndexOf(arr, val, prop) {
			var l = arr.length,
				k = 0;
			for (k = 0; k < l; k = k + 1) {
				if (arr[k][prop] === val) {
					return k;
				}
			}
			return false;
		}
		$scope.bellNotifications = [];
		if (Authentication.user) {
			for(var i = 0,len = Authentication.user.bellnotification.length;i < len ;i++) {
				if(Authentication.user.bellnotification[i].isSeen === false ){
					$scope.bellNotifications.push(Authentication.user.bellnotification[i]);
				}
			}
		}


		PusherService.listen('Channel-Public','Commnet-AddEvent', function(err, data) {
			$scope.bellNotifications.push(data);
		});

		PusherService.listen('Channel-Public','Post-LikeEvent', function(err, data) {
			$scope.bellNotifications.push(data);
		});

		PusherService.listen('Channel-Public','Commnet-LikeEvent', function(err, data) {
			$scope.bellNotifications.push(data);
		});


		$scope.imgPath = Authentication.user._id + '.png';
		$scope.isActive = true;
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
			if(langKey === 'hi') {
				$scope.isActive = false;
			} else {
				$scope.isActive = true;
			}

		};
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			if (!$scope.authentication.user ) {
				if ($location.path() === '/signup') {
					$location.path('/signup');
				}else if ($location.path() === '/password/forgot') {
					$location.path('/password/forgot');
				} else if($location.path() ==='/password/reset/' +$stateParams.token){
					$location.path('/password/reset/' +$stateParams.token);
				}
				else {
					$location.path('/#!');
				}
			}
			$scope.isCollapsed = false;
			$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		});

		PusherService.listen('Pusher-channel','Pusher-event', function(err, data) {
			toastr.success(data.message);
		});

		$scope.Redirect = function(bellnotificationid, feedid) {
			var index = getIndexOf($scope.bellNotifications, bellnotificationid, '_id');
			$scope.bellNotifications.splice(index, 1);
			$http.put('/users/updatebellnotification', {feedId: bellnotificationid}).success(function(response) {
				$location.path('companyfeeds/'+feedid);
			});
		};
	}
]);
