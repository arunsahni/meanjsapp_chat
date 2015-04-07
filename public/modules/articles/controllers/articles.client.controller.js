'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','PusherService',
	function($scope, $stateParams, $location, Authentication, Articles,PusherService) {
		$scope.authentication = Authentication;

		$scope.sumaChart = {
			chart: {
				type: 'bar',
				height: '400'

			},
			series: [{
				data: [10, 15, 12, 8, 7]
			}],
			title: {
				text: 'Sumasoft Highchart'
			},

			loading: false
		};

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

		};

		// Remove existing Article
		$scope.remove = function(article) {
			if (article) {
				Articles.deleteArticle(article).success(function (data) {
					$location.path('articles');
				});
			}
		};

		// Update existing Article
		$scope.update = function() {
			var article = $scope.article;

			Articles.updateArticle(article).success(function(data) {
				$location.path('articles/' + data._id);

			});

		};

		PusherService.listen('Pusher-channel','Pusher-event', function(err, data) {
			window.alert(data.message);
		});

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
		$scope.GeneratPusher=function(){
			//window.alert("Generating pusher");
			Articles.generatePusher().success(function(){
				console.log('Pusher Generated');
			});
		};
	}
]);
