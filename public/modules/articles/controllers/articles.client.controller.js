'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','toastr', '$modal','$rootScope', 'mySocket',
	function($scope, $stateParams, $location, Authentication, Articles, toastr, $modal, $rootScope, mySocket) {
		$scope.authentication = Authentication;
		if($stateParams && $stateParams.redirectUrl) {
			$scope.redirectUrl = $stateParams.redirectUrl;
		}
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		var modalInstance;
		$scope.toasterCheckSuc = function() {
			toastr.success('Message with Title', 'Successfully');
		};
		$scope.toasterCheckInf = function() {
			toastr.info('Message', 'Information');
		};
		$scope.toasterCheckErr = function() {
			toastr.error('Message', 'Error');
		};
		$scope.toasterCheckWar = function() {
			toastr.warning('Message', 'Warning');
		};
		$scope.toasterCheckWit = function() {
			toastr.success('I don\'t need a title to live');
		};
		$scope.toasterCheckAll = function() {
            toastr.success('Message with Title', 'Successfully');
            toastr.info('Message', 'Information');
            toastr.error('Message', 'Error');
            toastr.warning('Message', 'Warning');
            toastr.success('I don\'t need a title to live');
        };
        $scope.autoCompleteData = {
                EntityName: ['User'],
                Projection: ['firstName', '_id', 'isImage'],
                MatchField: 'firstName'
        };

		$scope.create = function() {
			$scope.title = this.title;
			$scope.content = this.content;
			Articles.saveArticle({
				title: $scope.title,
				content: $scope.content
			}).success(function (data) {
				toastr.success('Successfully', 'Article inserted');
				$scope.title = '';
				$scope.content = '';
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				Articles.deleteArticle(article).success(function (data) {
					$location.path('articles');
					toastr.success('Successfully', 'Article deleted');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;
			Articles.updateArticle(article).success(function(data) {
				$location.path('articles/' + data._id);
				toastr.success('Successfully', 'Article updated');
				modalInstance.close();
			});
		};

		// Find a list of Articles
		$scope.find = function() {
			Articles.getArticles().success(function(articles){
				$scope.articles = articles;
			});
		};

		// Find existing Article
		$scope.findOne = function() {
			Articles.getArticleById({
				articleId: $stateParams.articleId
			}).success(function (article) {
				$scope.article = article;
			});
		};

		//Test Pusher
		$scope.GeneratPusher = function(){
			//window.alert("Generating pusher");
			Articles.generatePusher().success(function(){
				console.log('Pusher Generated');
			});
		};

		// test window modal
		$scope.open = function(){
			modalInstance = $modal.open({
				templateUrl: 'modules/articles/views/edit-article.client.view.html',
				scope: $scope,
				resolve: {
					article: function () {
						return $scope.article;
					}
				}
			});
			modalInstance.result.then(function () {
			}, function () {
				//console.log('Modal dismissed at: ' + new Date());
			});
		};

		// Implement PayPal
		$scope.PayPal = function(){
			$location.path('/articles/views/paypalcreate');
		};

		$scope.paypalcreate = function(){
			Articles.paypalCreate({
				method: 'paypal',
				amount: this.amount,
				currency: this.currency
			}).success(function(payment){
				$rootScope.payment = payment;
				$scope.redirectUrl = '';
				if(payment.payer.payment_method === 'paypal') {
					for(var i=0; i < payment.links.length; i++) {
						var link = payment.links[i];
						if (link.method === 'REDIRECT') {
							$scope.redirectUrl = link.href;
						}
					}
				}
				$scope.redirectUrl = $scope.redirectUrl.split('?');
				$location.path('/articles/views/newpayment/' + $scope.redirectUrl[1]);
			});
		};

		$scope.excutePayment = function(){
			Articles.excutePayment({
				PayerID: $location.search().PayerID
			}).success(function(payment){
				$scope.paymentDetail = payment;
			});
		};
		//$scope.submitchat = function () {
		//	var packet = {
		//		id: Authentication.user._id,
		//		msg: $scope.msg,
		//		isImage: Authentication	.user.isImage
		//	};
		//	mySocket.emit('chat message', packet);
		//	$scope.msg = '';
		//};
		//$scope.Messages = [];
        //
		//mySocket.on('chat message', function(packet){
		//	if (Authentication.user._id === packet.id) {
		//		packet.type = 'Sender';
		//	} else {
		//		packet.type = 'Reciever';
		//	}
		//	$scope.Messages.push(packet);
        //
		//});
	}
]);
