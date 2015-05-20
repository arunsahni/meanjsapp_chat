'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus','toastr', 'PusherService','$translate','$location','$stateParams','mySocket','Chats','ngAudio',
	function($scope, $rootScope, Authentication, Menus, toastr, PusherService, $translate, $location, $stateParams, mySocket, Chats , ngAudio) {

		$scope.sound = ngAudio.load('sounds/chat.mp3');
		$scope.showChat = false;
		$scope.authentication = Authentication;

		$rootScope.$on('ImageChanged', function (event, args) {
			$scope.imgPath = args.ImagePath;
			Authentication.user.updated = args.Date;
		});


		$rootScope.$on('GroupImageChanged', function (event, args) {
			$scope.groupImage = args.ImagePath;
			//Authentication.user.updated = args.Date;
		});

		mySocket.on('user joined', function (data) {
			console.log('list',data);
		});

		$scope.removeUser = function(){
			mySocket.emit('remove user', $scope.authentication.user.displayName);
			console.log('Working on Anchor Tag');
		};

		window.onbeforeunload = function(e) {
			$scope.removeUser();
		};
		$scope.isCollapsed = false;
		$scope.prepareMenu = function() {
			if ($scope.authentication.user !== '') {
				$scope.groupImage = 'https://s3.amazonaws.com/sumacrm/groups/' + $scope.authentication.user.group._id + '?' + $scope.authentication.user.group.updated;
				$rootScope.menu = Menus.getMenu('topbar');
			}
		};
		$scope.isActive = true;

		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id + '?' + Authentication.user.updated;
		$scope.imgPathOwn = 'https://s3.amazonaws.com/sumacrm/avatars/';
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
			$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id + '?' + Authentication.user.updated;
		});

		PusherService.listen('Pusher-channel','Pusher-event', function(err, data) {
			toastr.success(data.message);
		});

	//	move logic

		$scope.submitchat = function () {
			var packet = {
				message: $scope.message,
				sender: {
					isImage: Authentication.user.isImage,
					displayName: Authentication.user.displayName,
					_id: Authentication.user._id
				},
				chatDate: new Date()
			};
			mySocket.emit('chat message', packet);
			//code for saving chat message
			Chats.saveMessageData({
				message: $scope.message,
				sender : Authentication.user._id ,
				reciever : null ,
				chatType : 'Public'
			}).success(function(){
				console.log('success');
			});
			$scope.message = '';
		};
		$scope.Messages = [];
		$scope.chatCount = 0;
		mySocket.on('chat message', function(packet){
			if (Authentication.user._id === packet.sender._id) {
				packet.type = 'Sender';
			} else {
				packet.type = 'Reciever';
				$scope.sound.play();
				if(!$scope.showChat) {
					$scope.chatCount = $scope.chatCount+1;
				}
			}
			var textarea = document.getElementById('textarea_id');
			textarea.scrollTop = textarea.scrollHeight;

			$scope.Messages.push(packet);
		});

		$scope.minWind = function() {
			if ($scope.showChat)
				$scope.showChat = false;
			else
				$scope.showChat = true;
			$scope.chatCount = 0;

			//code for getting last 10 chat message
			if ($scope.Messages.length === 0) {
				Chats.getMessageData({}).success(function (messageData) {
					for (var i = 0, len = messageData.length; i < len; i++) {
						if (Authentication.user._id === messageData[i].sender._id) {
							messageData[i].type = 'Sender';
						} else {
							messageData[i].type = 'Reciever';
						}
					}
					$scope.Messages = messageData;
					var textarea = document.getElementById('textarea_id');
					textarea.scrollTop = textarea.scrollHeight;
				});
			}
		};

	}
]);
