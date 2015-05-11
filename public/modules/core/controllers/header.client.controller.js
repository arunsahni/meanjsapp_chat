'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus','toastr', 'PusherService','$translate','$location','$stateParams',
	function($scope, $rootScope, Authentication, Menus, toastr, PusherService, $translate, $location, $stateParams) {

		$scope.authentication = Authentication;

		$scope.isCollapsed = false;
		$scope.prepareMenu = function() {
			if ($scope.authentication.user !== '') {
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
		$scope.Redirect = function(feedid) {
			var index = getIndexOf($scope.bellNotifications, feedid, '_id');
			$scope.bellNotifications.splice(index, 1);
			$location.path('companyfeeds/'+feedid);
		};
	}
]);
