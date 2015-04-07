'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','toastr',
	function($scope, $stateParams, $location, Authentication, Articles, toastr) {
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
		$scope.toasterCheck = function() {
			toastr.success('Message with Title', 'Successfully');
			toastr.info('Message', 'Information');
			toastr.error('Message', 'Error');
			toastr.warning('Message', 'Warning');
			toastr.success('I don\'t need a title to live');
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
