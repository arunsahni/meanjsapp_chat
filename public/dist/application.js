'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'meanjsapp';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'toastr', 'pusher-angular','angularFileUpload','pascalprecht.translate'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

angular.module(ApplicationConfiguration.applicationModuleName).config(["$translateProvider", function ($translateProvider) {
	$translateProvider.useStaticFilesLoader({
		prefix: '/language/',
		suffix: '.json'
	});
	$translateProvider.preferredLanguage('en');
}]);
//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('admins');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('companyfeeds');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('admins').run(['Menus', 'Authentication',
	function(Menus, Authentication) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admins', 'admins', 'dropdown', '/admins(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'admins', 'Role Management', 'userlist','userlist', false, ['admin']);
	}
]);

'use strict';



//Setting up route
angular.module('admins').config(['$stateProvider',
	function($stateProvider) {

		var checkRole = ["$q", "$timeout", "$location", "Authentication", function($q, $timeout, $location, Authentication) {
			// Initialize a new promise
			var deferred = $q.defer();
			var authentication = Authentication.user.roles[0];
			console.log(authentication);
			if (authentication === 'admin')
				$timeout(deferred.resolve);
			else {
					$timeout(deferred.reject);
					$location.url('/dashboard');
				}
			return deferred.promise;
		}];

		// Admins state routing
		$stateProvider.
			state('userlist', {
			url: '/userlist',
			templateUrl: 'modules/admins/views/userList.html',
			resolve: {
				checkRole: checkRole
			}
			});
	}
]);

'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admins',
	function($scope, $stateParams, $location, Authentication, Admins) {
		$scope.authentication = Authentication;
		$scope.userList = [];
		$scope.isActive = true;

		// For User list
		$scope.findUserList = function() {
			Admins.userList().success(function(response) {
				angular.forEach(response, function(val){
					if($scope.authentication.user._id !== val._id){
						$scope.userList.push(val);
					}
				});
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.roleChange = function(role,$index,user_id) { 
			var userRole = {
				userId: user_id,
				role: role
			};
			Admins.updateUserRole(userRole).success(function(user){
				$scope.userList[$index].roles[0] = user.roles[0];
			});
		};
	}
]);

'use strict';

//Admins service used to communicate Admins REST endpoints
angular.module('admins').factory('Admins', ['$http',
	function($http) {
		var adminFactory = {};

		adminFactory.userList = function (req,res) {
			return $http.get('/allUsers', req);
		};

		adminFactory.updateUserRole = function (req,res) {
			return $http.post('/changeRole', req);
		};
		return adminFactory;
	}
]);

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'acc.sub.das', 'dashboard', '/#!(/dashboard)');
		Menus.addMenuItem('topbar', 'acc.sub.art', 'articles', 'dropdown', '/articles(/create)?');
		Menus.addSubMenuItem('topbar', 'articles', 'acc.sub.item', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'acc.sub.new', 'articles/create');
	}
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles','toastr', '$modal',
	function($scope, $stateParams, $location, Authentication, Articles, toastr, $modal) {
		$scope.authentication = Authentication;
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

'use strict';

//Articles service used for communicating with the articles REST endpoints
	angular.module('articles').factory('Articles', ['$http',
	function($http) {
		var serviceFactory = {};

		serviceFactory.saveArticle = function (req,res) {
			return $http.post('/article/save', req);
		};

		serviceFactory.getArticles = function (req, res) {
			return $http.get('/articles');
		};

		serviceFactory.getArticleById = function (req, res) {
			return $http.get('article/' + req.articleId);
		};

		serviceFactory.updateArticle = function (req,res) {
			return $http.post('/article/update', req);
		};

		serviceFactory.deleteArticle = function (req, res) {
			return $http.post('/article/delete', req);
		};
		serviceFactory.generatePusher = function (req, res){
			return $http.get('/pusher');
		};
		return serviceFactory;
	}
]);

//'use strict';
//
//// Configuring the Articles module
//angular.module('companyfeeds').run(['Menus',
//	function(Menus) {
//		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Companyfeeds', 'companyfeeds', 'dropdown', '/companyfeeds(/create)?');
//		Menus.addSubMenuItem('topbar', 'companyfeeds', 'List Companyfeeds', 'companyfeeds');
//		Menus.addSubMenuItem('topbar', 'companyfeeds', 'New Companyfeed', 'companyfeeds/create');
//	}
//]);

'use strict';

//Setting up route
angular.module('companyfeeds').config(['$stateProvider',
	function($stateProvider) {
		// Companyfeeds state routing
		$stateProvider.
		state('listCompanyfeeds', {
			url: '/companyfeeds',
			templateUrl: 'modules/companyfeeds/views/list-companyfeeds.client.view.html'
		}).
		state('createCompanyfeed', {
			url: '/companyfeeds/create',
			templateUrl: 'modules/companyfeeds/views/create-companyfeed.client.view.html'
		}).
		state('viewCompanyfeed', {
			url: '/companyfeeds/:companyfeedId',
			templateUrl: 'modules/companyfeeds/views/view-companyfeed.client.view.html'
		}).
		state('editCompanyfeed', {
			url: '/companyfeeds/:companyfeedId/edit',
			templateUrl: 'modules/companyfeeds/views/edit-companyfeed.client.view.html'
		});
	}
]);

'use strict';

// Companyfeeds controller
angular.module('companyfeeds').controller('CompanyfeedsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companyfeeds','$modal',
	function($scope, $stateParams, $location, Authentication, Companyfeeds, $modal) {
		$scope.authentication = Authentication;
		var modalInstance;
		// Create new Companyfeed
		$scope.imgPath = Authentication.user._id + '.png';
		$scope.imgPath = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;
		$scope.imgPathOwn = 'https://s3.amazonaws.com/sumacrm/avatars/';

		$scope.create = function () {
			Companyfeeds.savecompanyfeed({
				name: this.name
			}).success(function (data) {
				delete $scope.name;
				$scope.companyfeeds = data;
			});
		};
        $scope.autoCompleteData = {
            EntityName: ['User'],
            Projection: ['firstName', '_id', 'isImage'],
            MatchField: 'firstName'
        };
		$scope.likersName = function(likerArray) {
            var i, len;
			$scope.LikerNameArray = likerArray;
            $scope.LikerName = '';
			for(i = 0, len = likerArray.length; i < len; i++) {
				$scope.LikerName = $scope.LikerName + '\n' + likerArray[i].user_name;
			}
		};
		// Remove existing Companyfeed
		$scope.remove = function (companyfeed) {
			if (companyfeed) {
				companyfeed.$remove();

				for (var i in $scope.companyfeeds) {
					if ($scope.companyfeeds [i] === companyfeed) {
						$scope.companyfeeds.splice(i, 1);
					}
				}
			} else {
				$scope.companyfeed.$remove(function () {
					$location.path('companyfeeds');
				});
			}
		};

		// Find a list of Companyfeeds
		$scope.init = function () {
			Companyfeeds.getcompanyfeeds().success(function (companyfeeds) {
				$scope.companyfeeds = companyfeeds;
			});
		};

		// Find existing Companyfeed
		$scope.findOne = function () {
			Companyfeeds.getcompanyfeedById({
				companyfeedId: $stateParams.companyfeedId
			}).success(function (companyfeed) {
				$scope.companyfeed = companyfeed;
			});
		};

		$scope.addComment = function (companyfeedId) {
			Companyfeeds.addCommentService({
				compnayfeedId: companyfeedId,
				comment: {
					user_id: Authentication.user._id,
					user_name:Authentication.user.displayName,
					comment: this.comment
				}
			}).success(function (companyfeeds) {
				$scope.companyfeeds = companyfeeds;
			});
		};
        $scope.isLiked = function (likers) {
            var i, len;
            for (i = 0, len = likers.length; i < len; i += 1) {
                if (likers[i].user_id === Authentication.user._id) {
                    return true;
                }
            }
            return false;
        };

		$scope.addLiker = function (index) {
            $scope.myFlag = true;
            if (!$scope.companyfeeds[index].likers.length || !$scope.isLiked($scope.companyfeeds[index].likers)) {
                Companyfeeds.addLiker({
                    compnayfeedId: $scope.companyfeeds[index]._id,
                    liker : {
                        user_id: Authentication.user._id,
                        user_name:Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;

                });
            } else {
                Companyfeeds.removeLiker({
                    compnayfeedId: $scope.companyfeeds[index]._id,
                    liker : {
                        user_id: Authentication.user._id,
                        user_name:Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;
                });
            }
		};

		$scope.addCommentLike = function (feedIndex, commentIndex) {
            $scope.myFlag = true;
            if (!$scope.companyfeeds[feedIndex].comment.length || !$scope.isLiked($scope.companyfeeds[feedIndex].comment[commentIndex].commentLiker)) {
                Companyfeeds.addCommentLike({
                    compnayfeedId: $scope.companyfeeds[feedIndex]._id,
                    commentId: $scope.companyfeeds[feedIndex].comment[commentIndex]._id,
                    commentLiker: {
                        user_id: Authentication.user._id,
                        user_name: Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;
                });
            } else {
                Companyfeeds.removeCommentLike({
                    compnayfeedId: $scope.companyfeeds[feedIndex]._id,
                    commentId: $scope.companyfeeds[feedIndex].comment[commentIndex]._id,
                    commentLiker: {
                        user_id: Authentication.user._id,
                        user_name: Authentication.user.displayName
                    }
                }).success(function (companyfeeds) {
                    $scope.companyfeeds = companyfeeds;
                    $scope.myFlag = false;
                });
            }
		};

        function getCompanyFeedById (userIds) {
            Companyfeeds.getcompanyfeedByUserId({userIds: userIds}).success(function (companyFeeds) {
                $scope.companyfeeds = companyFeeds;
            });
        }

        $scope.$watchCollection('data.tags',function(val){
            if ($scope.data && $scope.data.tags.length) {
                var userIds = $scope.data.tags.map(function (user) {
                    return user._id;
                });
                getCompanyFeedById(userIds);
            }
            if ($scope.data && $scope.data.tags.length === 0) {
                $scope.init();
            }
        });
		$scope.show_name = 'show More';

		$scope.paginationLimit = function(index) {
			$scope.companyfeeds[index].pagesShown =
				$scope.companyfeeds[index].pagesShown ? $scope.companyfeeds[index].pagesShown : 1;
			return 3 * $scope.companyfeeds[index].pagesShown;
		};
		$scope.hasMoreItemsToShow = function(index) {
			return $scope.companyfeeds[index].pagesShown < ($scope.companyfeeds[index].comment.length / 3);
		};
		$scope.showMoreItems = function(index) {
			$scope.companyfeeds[index].pagesShown = $scope.companyfeeds[index].pagesShown + 1;
		};
		$scope.showliker = function() {
			modalInstance = $modal.open({
				templateUrl: 'modules/companyfeeds/views/show-liker.client.view.html',
				scope: $scope,
				size: 'sm',
				resolve: {
					LikerNameArray: function () {
						return $scope.LikerNameArray;
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

/**
 * Created by sumasoft on 4/14/15.
 */
'use strict';

angular.module('companyfeeds').directive('toggle', ["$tooltip", function($tooltip){
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            attrs.tooltipPlacement = attrs.tooltipPlacement || 'bottom';
            attrs.tooltipAnimation = attrs.tooltipAnimation || true;
            attrs.tooltipPopupDelay = attrs.tooltipPopupDelay || 0;
            attrs.tooltipTrigger = attrs.tooltipTrigger || 'mouseenter';
            attrs.tooltipAppendToBody = attrs.tooltipAppendToBody || false;
        }
    };
}]);

'use strict';

//Companyfeeds service used to communicate Companyfeeds REST endpoints
angular.module('companyfeeds').factory('Companyfeeds', ['$http',
	function($http) {
		/*return $resource('companyfeeds/:companyfeedId', { companyfeedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});*/
		var serviceFactory = {};

		serviceFactory.savecompanyfeed = function (req,res) {
			return $http.post('/companyfeeds/save', req);
		};

		serviceFactory.getcompanyfeeds = function (req, res) {
			return $http.get('/companyfeeds');
		};

		serviceFactory.getcompanyfeedById = function (req, res) {
			return $http.get('companyfeeds/' + req.companyfeedId);
		};

		serviceFactory.updatecompanyfeed = function (req,res) {
			return $http.post('/companyfeeds/update', req);
		};

		serviceFactory.deletecompanyfeed = function (req, res) {
			return $http.post('/companyfeeds/delete', req);
		};
		serviceFactory.addCommentService = function(req,res){
			return $http.post('/companyfeeds/addcomment',req);
		};
		serviceFactory.getComment = function(req,res){
			return $http.get('/companyfeeds/getcomment',req.postId);
		};
		serviceFactory.addLiker = function(req,res){
			return $http.post('/companyfeeds/addlikers',req);
		};
		serviceFactory.addCommentLike = function(req,res){
			return $http.post('/companyfeeds/addCommentLike',req);
		};
        serviceFactory.removeCommentLike = function(req,res){
			return $http.post('/companyfeeds/removeCommentLike',req);
		};
        serviceFactory.getcompanyfeedByUserId = function(req,res){
            return $http.post('/companyfeeds/getcompanyfeedByUserId', req);
        };
        serviceFactory.removeLiker = function(req,res){
            return $http.post('/companyfeeds/removeLiker',req);
        };
		return serviceFactory;

	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
        state('dashboard', {
            url: '/dashboard',
            templateUrl: 'modules/core/views/home.client.view.html'
        });
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus','toastr', 'PusherService','$translate','$location','$stateParams',
	function($scope, Authentication, Menus, toastr, PusherService, $translate, $location, $stateParams) {

		$scope.authentication = Authentication;
		//$scope.showUser = false;
        //
		//$scope.$on('$stateChangeSuccess', function() {
		//	if($scope.authentication.user.roles == 'admin'){
		//		$scope.showUser = true;
		//	}
		//});

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
	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.sumaDashboardChart = {
			chart: {
				zoomType: 'x',
				height: 400
			},
			title: {
				text: 'Rupee to EUR exchange rate from 2014 through 2015'
			},
			subtitle: {
				text: document.ontouchstart === undefined ?
					'Click and drag in the plot area to zoom in' :
					'Pinch the chart to zoom in'
			},
			xAxis: {
				type: 'datetime',
				minRange: 14 * 24 * 3600000 // fourteen days
			},
			yAxis: {
				title: {
					text: 'Exchange rate'
				}
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				area: {
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
						]
					},
					marker: {
						radius: 2
					},
					lineWidth: 1,
					states: {
						hover: {
							lineWidth: 1
						}
					},
					threshold: null
				}
			},

			series: [{
				type: 'area',
				name: 'USD to EUR',
				pointInterval: 24 * 3600 * 1000,
				pointStart: Date.UTC(2006, 0, 1),
				data: [
					0.8446, 0.8445, 0.8444, 0.8451, 0.8418, 0.8264,    0.8258, 0.8232,    0.8233, 0.8258,
					0.8283, 0.8278, 0.8256, 0.8292, 0.8239, 0.8239,    0.8245, 0.8265,    0.8261, 0.8269,
					0.8273, 0.8244, 0.8244, 0.8172, 0.8139, 0.8146,    0.8164, 0.82,    0.8269, 0.8269,
					0.8269, 0.8258, 0.8247, 0.8286, 0.8289, 0.8316,    0.832, 0.8333,    0.8352, 0.8357,
					0.8355, 0.8354, 0.8403, 0.8403, 0.8406, 0.8403,    0.8396, 0.8418,    0.8409, 0.8384,
					0.8386, 0.8372, 0.839, 0.84
				]
			}]
		};
		$scope.sumaSoftDashboardChart = {
			chart: {
				type: 'line',
				height: 440
			},
			title: {
				text: 'Sumasoft Second Highchart'
			},
			subtitle: {
				text: 'Source: WorldClimate.com'
			},
			xAxis: {
				categories: [
					'Jan',
					'Feb',
					'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			},
			yAxis: {
				title: {
					text: 'Temperature (°C)'
				}
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true
					},
					enableMouseTracking: false
				}
			},
			series: [{
				name: 'India',
				data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			}, {
				name: 'Pune',
				data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			}]
		};
	}
]);

'use strict';

angular.module('core').directive('autoComplete', ['$http', 'AutoComplete', function ($http, AutoComplete) {
    return {
        restrict:'AE',
        scope:{
            selectedTags:'=model',
            metaData: '=value'
        },
        templateUrl: '/modules/core/views/autocomplete-template.html',
        link:function(scope, elem, attrs){
            scope.suggestions = [];
            scope.selectedTags = [];
            scope.selectedTagsIds = [];
            scope.selectedIndex = -1;

            scope.removeTag = function (index) {
                scope.selectedTags.splice(index,1);
            };

            scope.search = function () {
                if (!!scope.searchText) {
                    AutoComplete.getAutoCompleteData({
                        EntityName: scope.metaData.EntityName,
                        Projection: scope.metaData.Projection,
                        MatchField: scope.metaData.MatchField,
                        SearchText: scope.searchText,
                        selectedTagsIds: scope.selectedTagsIds
                    }).success(function (data) {
                        var finalData = [];
                        if (scope.selectedTags.length) {
                            finalData = data.filter(function(obj) { return scope.selectedTagsIds.indexOf(obj._id) === -1; });
                        } else {
                            finalData = data;
                        }
                        scope.suggestions = finalData;
                        scope.selectedIndex = -1;
                    });
                } else {
                    delete scope.suggestions;
                }
            };

            scope.addToSelectedTags = function (index) {
                if (index !==-1 && scope.selectedTags.indexOf(scope.suggestions[index])===-1) {
                    scope.selectedTags.push(scope.suggestions[index]);
                    scope.selectedTagsIds.push(scope.suggestions[index]._id);
                    scope.searchText = '';
                    scope.suggestions = [];
                }
            };

            scope.checkKeyDown = function (event) {
                if (event.keyCode===40) {
                    event.preventDefault();
                    if (scope.selectedIndex+1 !== scope.suggestions.length) {
                        scope.selectedIndex++;
                    }
                }
                else if (event.keyCode===38) {
                    event.preventDefault();
                    if (scope.selectedIndex-1 !== -1) {
                        scope.selectedIndex--;
                    }
                }
                else if (event.keyCode===13) {
                    scope.addToSelectedTags(scope.selectedIndex);
                }
            };

            scope.$watch('selectedIndex',function (val) {
                if(val!==-1) {
                    scope.searchText = scope.suggestions[scope.selectedIndex][scope.metaData.MatchField];
                }
            });
        }
    };
}]);

'use strict';

angular.module('core').directive('pvntDblClick', ["$timeout", function ($timeout) {
    return {
        restrict: 'A',
        transclude: true,
        replace: true,
        link: function($scope, elm) {
            elm.on('click', function() {
                console.log('clicked');
                $timeout(function() {
                    elm.attr('disabled', true);
                    $timeout(function() {
                        elm.attr('disabled', false);
                    }, 3000);
                }, 0);
            });
        }
    };
}]);

'use strict';

angular.module('core').directive('sumahighchart', function () {
	return {
		restrict: 'E',
		template: '<div></div>',
		scope: {
			chartData: '=value',
			chartObj: '=?'
		},
		transclude: true,
		replace: true,
		link: function($scope, $element, $attrs) {

			//Update when charts data changes
			$scope.$watch('chartData', function(value) {
				if (!value)
					return;
				$scope.chartData.chart = $scope.chartData.chart || {};
				$scope.chartData.chart.renderTo = $scope.chartData.chart.renderTo || $element[0];
				$scope.chartObj = new Highcharts.Chart($scope.chartData);
			});
		}
	};
});

'use strict';

angular.module('core').factory('AutoComplete', ['$http',
    function($http) {
        var AutoCompleteService = {};

        AutoCompleteService.getAutoCompleteData = function (req, res) {
            return $http.post('autoComplete/getAutoCompleteData', req);
        };

        return AutoCompleteService;
    }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
/**
 * Created by sumasoft on 4/7/15.
 */
'use strict';

//Pusher service used for communicating with the articles REST endpoints
angular.module('core').factory('PusherService', ['$pusher' ,
    function($pusher){
        var PusherService = {};
        //We will move this key into somewhere else, may be in Enum file later - Pankaj
        var client = new Pusher('f9ee22d1cb0b7cc349e6');
        var pusher = $pusher(client);
        PusherService.listen = function (ChannelName, eventName, callback) {
            pusher.subscribe(ChannelName).bind(eventName, function(data) {
                callback(null, data);
            });
        };
        return PusherService;
    }

]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'toastr',
	function($scope, $http, $location, Authentication, toastr) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/companyfeeds/create');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				toastr.info('You have signed up', 'Successfully');
				// And redirect to the index page
				$location.path('/companyfeeds/create');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/companyfeeds/create');
                toastr.success('You are successfully logged in.', 'done');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;
			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', 'toastr', '$upload',
	function($scope, $http, $location, Users, Authentication, toastr, $upload) {
		$scope.user = Authentication.user;
        $scope.uploadedImage = 'https://s3.amazonaws.com/sumacrm/avatars/' + Authentication.user._id;

		var executeOnSignedUrl = function(file, callback) {
			var this_s3upload, xhr;
			this_s3upload = this;
			xhr = new XMLHttpRequest();
			xhr.open('GET', '/sign_s3' + '?s3_object_type=' + file.type + '&s3_object_name=' + 'default_name', true);
			xhr.overrideMimeType('text/plain; charset=x-user-defined');
			xhr.onreadystatechange = function(e) {
				var result;
				if (this.readyState === 4 && this.status === 200) {
					try {
						result = JSON.parse(this.responseText);
					} catch (error) {
						this_s3upload.onError('Signing server returned some ugly/empty JSON: "' + this.responseText + '"');
						return false;
					}
					return callback(result.signed_request, result.url);
				} else if (this.readyState === 4 && this.status !== 200) {
					return this_s3upload.onError('Could not contact request signing server. Status = ' + this.status);
				}
			};
			return xhr.send();
		};

		var createCORSRequest = function(method, url) {
			var xhr;
			xhr = new XMLHttpRequest();
			if (xhr.withCredentials !== null) {
				xhr.open(method, url, true);
			} else if (typeof XDomainRequest !== 'undefined') {
				xhr = new XDomainRequest();
				xhr.open(method, url);
			} else {
				xhr = null;
			}
			return xhr;
		};

		var uploadToS3 = function(file, url, public_url) {
			var this_s3upload, xhr;
			this_s3upload = this;
			xhr = createCORSRequest('PUT', url);
			if (!xhr) {
				this.onError('CORS not supported');
			} else {
				xhr.onload = function() {
					if (xhr.status === 200) {
						//this_s3upload.onProgress(100, 'Upload completed.');
						//return this_s3upload.onFinishS3Put(public_url);
						$scope.uploadedImage = public_url;
						toastr.success('File Uploaded Succsessfully');
						$scope.$apply();
						window.location.reload();
						//$location.path('/settings/profile');
					} else {
						console.log('Upload error: ' + xhr.status);
						//return this_s3upload.onError('Upload error: ' + xhr.status);
					}
				};
				xhr.onerror = function() {
					return this_s3upload.onError('XHR error.');
				};
				xhr.upload.onprogress = function(e) {
					var percentLoaded;
					if (e.lengthComputable) {
						percentLoaded = Math.round((e.loaded / e.total) * 100);
						$scope.uploadProgress = percentLoaded;
						$scope.$apply();
						//return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing.' : 'Uploading.');
					}
				};
			}
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.setRequestHeader('x-amz-acl', 'public-read');
			return xhr.send(file);
		};

		var uploadFile = function(file) {
			return executeOnSignedUrl(file, function(signedURL, publicURL) {
				return uploadToS3(file, signedURL, publicURL);
			});
		};


		$scope.onFileSelect = function(image) {
			if (image.length) {
				if (angular.isArray(image)) {
					image = image[0];
				}
				if (image.size > 500000) {
					toastr.error('Image size should be less than 500KB');
					return;
				}
				if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
					toastr.error('Only PNG and JPEG are accepted.');
					return;
				}
				$scope.uploadInProgress = true;
				$scope.uploadProgress = 0;

				$scope.test = uploadFile(image);

				/*$scope.upload = $upload.upload({
					url: '/upload/image',
					method: 'POST',
					file: image
				}).progress(function (event) {
					$scope.uploadProgress = Math.floor(event.loaded / event.total);
				}).success(function (data, status, headers, config) {
					$scope.uploadInProgress = false;
					$scope.uploadedImage = $scope.user._id + '.png';
				}).error(function (err) {
					$scope.uploadInProgress = false;
					console.log('Error uploading file: ' + err.message || err);
				});*/
			}
		};




		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				if($scope.uploadedImage){
					$scope.user.isImage = true;
				}
				var user = new Users($scope.user);
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
				toastr.success('Your Password Change Successfully ', 'Done');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

/**
 * Created by arunsahni on 4/7/15.
 */
/**
 * Created by sumasoft on 3/25/15.
 */
'use strict';

angular.module('users').directive('uiUpload', ["$upload", function($upload) {
    return {
        templateUrl: 'meanjsapp/public/modules/users/views/settings/uploadImage.html',
        scope: {
            fileDest: '=',
            filename: '=',
            uploadCallback: '&',
            uploadFileCallback: '&'
        },
        restrict: 'E',
        replace: false,
        link: function($scope, element, attrs) {
            $scope.onFileSelect = function($files) {
                var files = [];
                $scope.files = $files;

                //$files: an array of files selected, each file has name, size, and type.
                //for (var i = 0; i < $files.length; i++) {
                    var file = $files[0];
                    console.log(file);
                    $scope.upload = $upload.upload({
                        url: 'fileUpload/upload',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: {
                            dest: $scope.fileDest,
                            filename:$scope.filename
                        },
                        file: file
                    }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        if (data.success) {
                            if (angular.isDefined(attrs.uploadFileCallback)) {
                                $scope.uploadFileCallback({
                                    file: data.file
                                });
                            }
                            files.push(data.file);
                        }
                        if (files.length === $files.length) {
                            if (angular.isDefined(attrs.uploadCallback)) {
                                $scope.uploadCallback({
                                    files: files
                                });
                            }
                        }
                    });
                //}
            };
        }
    };
}]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);