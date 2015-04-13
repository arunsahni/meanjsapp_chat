'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus','toastr', 'PusherService','$translate','$location','$stateParams',
	function($scope, Authentication, Menus, toastr, PusherService, $translate, $location, $stateParams) {

		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.imgPath = Authentication.user._id + '.png';
		$scope.isActive = true;
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
			$scope.isActive = !$scope.isActive;
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
