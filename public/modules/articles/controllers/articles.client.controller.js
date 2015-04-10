'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','toastr', '$modal','$translate',
	function($scope, $stateParams, $location, Authentication, Articles, toastr, $modal,$translate) {
		$scope.authentication = Authentication;
		var modalInstance;
		$scope.changeLanguage = function (langKey) {
			$translate.use(langKey);
		};
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
		$scope.GeneratPusher = function(){
			//window.alert("Generating pusher");
			Articles.generatePusher().success(function(){
				console.log('Pusher Generated');
			});
		};
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
	}
]);
