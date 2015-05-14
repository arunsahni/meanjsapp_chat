'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus','toastr', 'PusherService','$translate','$location','$stateParams','mySocket',
	function($scope, $rootScope, Authentication, Menus, toastr, PusherService, $translate, $location, $stateParams, mySocket) {
		$scope.showChat = true;
		$scope.authentication = Authentication;

		$scope.isCollapsed = false;
		$scope.prepareMenu = function() {
			if ($scope.authentication.user !== '') {
				$scope.groupImage = 'https://s3.amazonaws.com/sumacrm/groups/' + Authentication.user.group._id;
				$rootScope.menu = Menus.getMenu('topbar');
			}
		};

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

	//	move logic

		$scope.submitchat = function () {
			var packet = {
				id: Authentication.user._id,
				msg: $scope.msg,
				isImage: Authentication.user.isImage,
				name: Authentication.user.displayName
			};
			mySocket.emit('chat message', packet);
			$scope.msg = '';
		};
		$scope.Messages = [];

		mySocket.on('chat message', function(packet){
			if (Authentication.user._id === packet.id) {
				packet.type = 'Sender';
			} else {
				packet.type = 'Reciever';
			}
			$scope.Messages.push(packet);

		});

		$scope.minWind = function(){
			if($scope.showChat)
				$scope.showChat = false;
			else
				$scope.showChat = true;
		}
	}
]);
