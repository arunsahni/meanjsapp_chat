'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus','toastr', 'PusherService',
	function($scope, Authentication, Menus, toastr, PusherService) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
			$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		});

		PusherService.listen('Pusher-channel','Pusher-event', function(err, data) {
			toastr.success(data.message);
		});
	}
]);
