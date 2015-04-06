'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','$pusher',
	function($scope, $stateParams, $location, Authentication, Articles, $pusher) {
		$scope.authentication = Authentication;

		var client = new Pusher('f9ee22d1cb0b7cc349e6');
		var pusher = $pusher(client);
		var channel = pusher.subscribe('Article-channel');


		$scope.create = function() {
			$scope.title = this.title;
			$scope.content = this.content;
			Articles.saveArticle({
				title: $scope.title,
				content: $scope.content
			}).success(function (data) {
				$scope.title = '';
				$scope.content = '';
			});
			channel.bind('Created-event', function(data1) {
				window.alert('Message: ' + data1.message);
			});
		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				Articles.deleteArticle(article).success(function (data) {

					$location.path('articles');
				});
			}
			channel.bind('Deleted-event', function(data1) {
				window.alert('Message: ' + data1.message);
			});
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			Articles.updateArticle(article).success(function(data) {

				channel.bind('Update-event', function(data) {
					window.alert('Message: ' + data.message);
				});
				$location.path('articles/' + data._id);

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
	}
]);
