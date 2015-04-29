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
		$scope.bellNotifications = [];
		PusherService.listen('Channel-Public','Commnet-AddEvent', function(err, data) {
			//toastr.success(data.message);
			$scope.bellNotifications.push(data.message);
			//$scope.init();
		});

		PusherService.listen('Channel-Public','Post-LikeEvent', function(err, data) {
			//toastr.success(data.message);
			$scope.bellNotifications.push(data.data);
			//$scope.init();
		});

		PusherService.listen('Channel-Public','Post-UnLikeEvent', function(err, data) {
			toastr.success(data.message);
			$scope.bellNotifications.push(data.message);
			//$scope.init();
		});

		PusherService.listen('Channel-Public','Commnet-UnLikeEvent', function(err, data) {
			//toastr.success(data.message);
			$scope.bellNotifications.push(data.message);
			//$scope.init();
		});

		PusherService.listen('Channel-Public','Commnet-LikeEvent', function(err, data) {
			//toastr.success(data.message);
			$scope.bellNotifications.push(data.message);
			//$scope.init();
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
	}
]);
