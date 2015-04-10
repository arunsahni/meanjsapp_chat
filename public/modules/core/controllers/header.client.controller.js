'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus','toastr', 'PusherService','$translate',
	function($scope, Authentication, Menus, toastr, PusherService, $translate) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.imgPath = Authentication.user._id + '.png';

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
		};
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
			$scope.imgPath = Authentication.user._id + '.png';
		});

		PusherService.listen('Pusher-channel','Pusher-event', function(err, data) {
			toastr.success(data.message);
		});
	}
]);
