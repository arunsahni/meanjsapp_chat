"use strict";var ApplicationConfiguration=function(){var applicationModuleName="meanjsapp",applicationModuleVendorDependencies=["ngResource","ngCookies","ngAnimate","ngTouch","ngSanitize","ui.router","ui.bootstrap","ui.utils","toastr","pusher-angular","angularFileUpload","pascalprecht.translate"],registerModule=function(moduleName,dependencies){angular.module(moduleName,dependencies||[]),angular.module(applicationModuleName).requires.push(moduleName)};return{applicationModuleName:applicationModuleName,applicationModuleVendorDependencies:applicationModuleVendorDependencies,registerModule:registerModule}}();angular.module(ApplicationConfiguration.applicationModuleName,ApplicationConfiguration.applicationModuleVendorDependencies),angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider",function($locationProvider){$locationProvider.hashPrefix("!")}]),angular.module(ApplicationConfiguration.applicationModuleName).config(["$translateProvider",function($translateProvider){$translateProvider.useStaticFilesLoader({prefix:"/language/",suffix:".json"}),$translateProvider.preferredLanguage("en")}]),angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!"),angular.bootstrap(document,[ApplicationConfiguration.applicationModuleName])}),ApplicationConfiguration.registerModule("articles"),ApplicationConfiguration.registerModule("companyfeeds"),ApplicationConfiguration.registerModule("core"),ApplicationConfiguration.registerModule("users"),angular.module("articles").run(["Menus",function(Menus){Menus.addMenuItem("topbar","acc.sub.das","dashboard","/#!(/dashboard)"),Menus.addMenuItem("topbar","acc.sub.art","articles","dropdown","/articles(/create)?"),Menus.addSubMenuItem("topbar","articles","acc.sub.item","articles"),Menus.addSubMenuItem("topbar","articles","acc.sub.new","articles/create")}]),angular.module("articles").config(["$stateProvider",function($stateProvider){$stateProvider.state("listArticles",{url:"/articles",templateUrl:"modules/articles/views/list-articles.client.view.html"}).state("createArticle",{url:"/articles/create",templateUrl:"modules/articles/views/create-article.client.view.html"}).state("viewArticle",{url:"/articles/:articleId",templateUrl:"modules/articles/views/view-article.client.view.html"}).state("editArticle",{url:"/articles/:articleId/edit",templateUrl:"modules/articles/views/edit-article.client.view.html"})}]),angular.module("articles").controller("ArticlesController",["$scope","$stateParams","$location","Authentication","Articles","toastr","$modal",function($scope,$stateParams,$location,Authentication,Articles,toastr,$modal){$scope.authentication=Authentication;var modalInstance;$scope.toasterCheckSuc=function(){toastr.success("Message with Title","Successfully")},$scope.toasterCheckInf=function(){toastr.info("Message","Information")},$scope.toasterCheckErr=function(){toastr.error("Message","Error")},$scope.toasterCheckWar=function(){toastr.warning("Message","Warning")},$scope.toasterCheckWit=function(){toastr.success("I don't need a title to live")},$scope.toasterCheckAll=function(){toastr.success("Message with Title","Successfully"),toastr.info("Message","Information"),toastr.error("Message","Error"),toastr.warning("Message","Warning"),toastr.success("I don't need a title to live")},$scope.autoCompleteData={EntityName:["User"],Projection:["firstName","_id","isImage"],MatchField:"firstName"},$scope.create=function(){$scope.title=this.title,$scope.content=this.content,Articles.saveArticle({title:$scope.title,content:$scope.content}).success(function(data){toastr.success("Successfully","Article inserted"),$scope.title="",$scope.content=""})},$scope.remove=function(article){article&&Articles.deleteArticle(article).success(function(data){$location.path("articles"),toastr.success("Successfully","Article deleted")})},$scope.update=function(){var article=$scope.article;Articles.updateArticle(article).success(function(data){$location.path("articles/"+data._id),toastr.success("Successfully","Article updated"),modalInstance.close()})},$scope.find=function(){Articles.getArticles().success(function(articles){$scope.articles=articles})},$scope.findOne=function(){Articles.getArticleById({articleId:$stateParams.articleId}).success(function(article){$scope.article=article})},$scope.GeneratPusher=function(){Articles.generatePusher().success(function(){console.log("Pusher Generated")})},$scope.open=function(){modalInstance=$modal.open({templateUrl:"modules/articles/views/edit-article.client.view.html",scope:$scope,resolve:{article:function(){return $scope.article}}}),modalInstance.result.then(function(){},function(){})}}]),angular.module("articles").factory("Articles",["$http",function($http){var serviceFactory={};return serviceFactory.saveArticle=function(req,res){return $http.post("/article/save",req)},serviceFactory.getArticles=function(req,res){return $http.get("/articles")},serviceFactory.getArticleById=function(req,res){return $http.get("article/"+req.articleId)},serviceFactory.updateArticle=function(req,res){return $http.post("/article/update",req)},serviceFactory.deleteArticle=function(req,res){return $http.post("/article/delete",req)},serviceFactory.generatePusher=function(req,res){return $http.get("/pusher")},serviceFactory}]),angular.module("companyfeeds").config(["$stateProvider",function($stateProvider){$stateProvider.state("listCompanyfeeds",{url:"/companyfeeds",templateUrl:"modules/companyfeeds/views/list-companyfeeds.client.view.html"}).state("createCompanyfeed",{url:"/companyfeeds/create",templateUrl:"modules/companyfeeds/views/create-companyfeed.client.view.html"}).state("viewCompanyfeed",{url:"/companyfeeds/:companyfeedId",templateUrl:"modules/companyfeeds/views/view-companyfeed.client.view.html"}).state("editCompanyfeed",{url:"/companyfeeds/:companyfeedId/edit",templateUrl:"modules/companyfeeds/views/edit-companyfeed.client.view.html"})}]),angular.module("companyfeeds").controller("CompanyfeedsController",["$scope","$stateParams","$location","Authentication","Companyfeeds","$modal",function($scope,$stateParams,$location,Authentication,Companyfeeds,$modal){function getCompanyFeedById(userIds){Companyfeeds.getcompanyfeedByUserId({userIds:userIds}).success(function(companyFeeds){$scope.companyfeeds=companyFeeds})}$scope.authentication=Authentication;var modalInstance;$scope.imgPath=Authentication.user._id+".png",$scope.imgPath="https://s3.amazonaws.com/sumacrm/avatars/"+Authentication.user._id,$scope.imgPathOwn="https://s3.amazonaws.com/sumacrm/avatars/",$scope.create=function(){Companyfeeds.savecompanyfeed({name:this.name}).success(function(data){delete $scope.name,$scope.companyfeeds=data})},$scope.autoCompleteData={EntityName:["User"],Projection:["firstName","_id","isImage"],MatchField:"firstName"},$scope.likersName=function(likerArray){var i,len;for($scope.LikerNameArray=likerArray,$scope.LikerName="",i=0,len=likerArray.length;len>i;i++)$scope.LikerName=$scope.LikerName+"\n"+likerArray[i].user_name},$scope.remove=function(companyfeed){if(companyfeed){companyfeed.$remove();for(var i in $scope.companyfeeds)$scope.companyfeeds[i]===companyfeed&&$scope.companyfeeds.splice(i,1)}else $scope.companyfeed.$remove(function(){$location.path("companyfeeds")})},$scope.init=function(){Companyfeeds.getcompanyfeeds().success(function(companyfeeds){$scope.companyfeeds=companyfeeds})},$scope.findOne=function(){Companyfeeds.getcompanyfeedById({companyfeedId:$stateParams.companyfeedId}).success(function(companyfeed){$scope.companyfeed=companyfeed})},$scope.addComment=function(companyfeedId){Companyfeeds.addCommentService({compnayfeedId:companyfeedId,comment:{user_id:Authentication.user._id,user_name:Authentication.user.displayName,comment:this.comment}}).success(function(companyfeeds){$scope.companyfeeds=companyfeeds})},$scope.isLiked=function(likers){var i,len;for(i=0,len=likers.length;len>i;i+=1)if(likers[i].user_id===Authentication.user._id)return!0;return!1},$scope.addLiker=function(index){$scope.myFlag=!0,$scope.companyfeeds[index].likers.length&&$scope.isLiked($scope.companyfeeds[index].likers)?Companyfeeds.removeLiker({compnayfeedId:$scope.companyfeeds[index]._id,liker:{user_id:Authentication.user._id,user_name:Authentication.user.displayName}}).success(function(companyfeeds){$scope.companyfeeds=companyfeeds,$scope.myFlag=!1}):Companyfeeds.addLiker({compnayfeedId:$scope.companyfeeds[index]._id,liker:{user_id:Authentication.user._id,user_name:Authentication.user.displayName}}).success(function(companyfeeds){$scope.companyfeeds=companyfeeds,$scope.myFlag=!1})},$scope.addCommentLike=function(feedIndex,commentIndex){$scope.myFlag=!0,$scope.companyfeeds[feedIndex].comment.length&&$scope.isLiked($scope.companyfeeds[feedIndex].comment[commentIndex].commentLiker)?Companyfeeds.removeCommentLike({compnayfeedId:$scope.companyfeeds[feedIndex]._id,commentId:$scope.companyfeeds[feedIndex].comment[commentIndex]._id,commentLiker:{user_id:Authentication.user._id,user_name:Authentication.user.displayName}}).success(function(companyfeeds){$scope.companyfeeds=companyfeeds,$scope.myFlag=!1}):Companyfeeds.addCommentLike({compnayfeedId:$scope.companyfeeds[feedIndex]._id,commentId:$scope.companyfeeds[feedIndex].comment[commentIndex]._id,commentLiker:{user_id:Authentication.user._id,user_name:Authentication.user.displayName}}).success(function(companyfeeds){$scope.companyfeeds=companyfeeds,$scope.myFlag=!1})},$scope.$watchCollection("data.tags",function(val){if($scope.data&&$scope.data.tags.length){var userIds=$scope.data.tags.map(function(user){return user._id});getCompanyFeedById(userIds)}$scope.data&&0===$scope.data.tags.length&&$scope.init()}),$scope.show_name="show More",$scope.paginationLimit=function(index){return $scope.companyfeeds[index].pagesShown=$scope.companyfeeds[index].pagesShown?$scope.companyfeeds[index].pagesShown:1,3*$scope.companyfeeds[index].pagesShown},$scope.hasMoreItemsToShow=function(index){return $scope.companyfeeds[index].pagesShown<$scope.companyfeeds[index].comment.length/3},$scope.showMoreItems=function(index){$scope.companyfeeds[index].pagesShown=$scope.companyfeeds[index].pagesShown+1},$scope.showliker=function(){modalInstance=$modal.open({templateUrl:"modules/companyfeeds/views/show-liker.client.view.html",scope:$scope,size:"sm",resolve:{LikerNameArray:function(){return $scope.LikerNameArray}}}),modalInstance.result.then(function(){},function(){})}}]),angular.module("companyfeeds").directive("toggle",["$tooltip",function($tooltip){return{restrict:"EA",link:function(scope,element,attrs){attrs.tooltipPlacement=attrs.tooltipPlacement||"bottom",attrs.tooltipAnimation=attrs.tooltipAnimation||!0,attrs.tooltipPopupDelay=attrs.tooltipPopupDelay||0,attrs.tooltipTrigger=attrs.tooltipTrigger||"mouseenter",attrs.tooltipAppendToBody=attrs.tooltipAppendToBody||!1}}}]),angular.module("companyfeeds").factory("Companyfeeds",["$http",function($http){var serviceFactory={};return serviceFactory.savecompanyfeed=function(req,res){return $http.post("/companyfeeds/save",req)},serviceFactory.getcompanyfeeds=function(req,res){return $http.get("/companyfeeds")},serviceFactory.getcompanyfeedById=function(req,res){return $http.get("companyfeeds/"+req.companyfeedId)},serviceFactory.updatecompanyfeed=function(req,res){return $http.post("/companyfeeds/update",req)},serviceFactory.deletecompanyfeed=function(req,res){return $http.post("/companyfeeds/delete",req)},serviceFactory.addCommentService=function(req,res){return $http.post("/companyfeeds/addcomment",req)},serviceFactory.getComment=function(req,res){return $http.get("/companyfeeds/getcomment",req.postId)},serviceFactory.addLiker=function(req,res){return $http.post("/companyfeeds/addlikers",req)},serviceFactory.addCommentLike=function(req,res){return $http.post("/companyfeeds/addCommentLike",req)},serviceFactory.removeCommentLike=function(req,res){return $http.post("/companyfeeds/removeCommentLike",req)},serviceFactory.getcompanyfeedByUserId=function(req,res){return $http.post("/companyfeeds/getcompanyfeedByUserId",req)},serviceFactory.removeLiker=function(req,res){return $http.post("/companyfeeds/removeLiker",req)},serviceFactory}]),angular.module("core").config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("home",{url:"/",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("dashboard",{url:"/dashboard",templateUrl:"modules/core/views/home.client.view.html"})}]),angular.module("core").controller("HeaderController",["$scope","Authentication","Menus","toastr","PusherService","$translate","$location","$stateParams",function($scope,Authentication,Menus,toastr,PusherService,$translate,$location,$stateParams){$scope.authentication=Authentication,$scope.isCollapsed=!1,$scope.menu=Menus.getMenu("topbar"),$scope.imgPath=Authentication.user._id+".png",$scope.isActive=!0,$scope.imgPath="https://s3.amazonaws.com/sumacrm/avatars/"+Authentication.user._id,$scope.toggleCollapsibleMenu=function(){$scope.isCollapsed=!$scope.isCollapsed},$scope.changeLanguage=function(langKey){$translate.use(langKey),$scope.isActive="hi"===langKey?!1:!0},$scope.$on("$stateChangeSuccess",function(){$scope.authentication.user||$location.path("/signup"===$location.path()?"/signup":"/password/forgot"===$location.path()?"/password/forgot":$location.path()==="/password/reset/"+$stateParams.token?"/password/reset/"+$stateParams.token:"/#!"),$scope.isCollapsed=!1,$scope.imgPath="https://s3.amazonaws.com/sumacrm/avatars/"+Authentication.user._id}),PusherService.listen("Pusher-channel","Pusher-event",function(err,data){toastr.success(data.message)})}]),angular.module("core").controller("HomeController",["$scope","Authentication",function($scope,Authentication){$scope.authentication=Authentication,$scope.sumaDashboardChart={chart:{zoomType:"x",height:400},title:{text:"Rupee to EUR exchange rate from 2014 through 2015"},subtitle:{text:void 0===document.ontouchstart?"Click and drag in the plot area to zoom in":"Pinch the chart to zoom in"},xAxis:{type:"datetime",minRange:12096e5},yAxis:{title:{text:"Exchange rate"}},legend:{enabled:!1},plotOptions:{area:{fillColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,Highcharts.getOptions().colors[0]],[1,Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get("rgba")]]},marker:{radius:2},lineWidth:1,states:{hover:{lineWidth:1}},threshold:null}},series:[{type:"area",name:"USD to EUR",pointInterval:864e5,pointStart:Date.UTC(2006,0,1),data:[.8446,.8445,.8444,.8451,.8418,.8264,.8258,.8232,.8233,.8258,.8283,.8278,.8256,.8292,.8239,.8239,.8245,.8265,.8261,.8269,.8273,.8244,.8244,.8172,.8139,.8146,.8164,.82,.8269,.8269,.8269,.8258,.8247,.8286,.8289,.8316,.832,.8333,.8352,.8357,.8355,.8354,.8403,.8403,.8406,.8403,.8396,.8418,.8409,.8384,.8386,.8372,.839,.84]}]},$scope.sumaSoftDashboardChart={chart:{type:"line",height:440},title:{text:"Sumasoft Second Highchart"},subtitle:{text:"Source: WorldClimate.com"},xAxis:{categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},yAxis:{title:{text:"Temperature (°C)"}},plotOptions:{line:{dataLabels:{enabled:!0},enableMouseTracking:!1}},series:[{name:"India",data:[7,6.9,9.5,14.5,18.4,21.5,25.2,26.5,23.3,18.3,13.9,9.6]},{name:"Pune",data:[3.9,4.2,5.7,8.5,11.9,15.2,17,16.6,14.2,10.3,6.6,4.8]}]}}]),angular.module("core").directive("autoComplete",["$http","AutoComplete",function($http,AutoComplete){return{restrict:"AE",scope:{selectedTags:"=model",metaData:"=value"},templateUrl:"/modules/core/views/autocomplete-template.html",link:function(scope,elem,attrs){scope.suggestions=[],scope.selectedTags=[],scope.selectedTagsIds=[],scope.selectedIndex=-1,scope.removeTag=function(index){scope.selectedTags.splice(index,1)},scope.search=function(){scope.searchText?AutoComplete.getAutoCompleteData({EntityName:scope.metaData.EntityName,Projection:scope.metaData.Projection,MatchField:scope.metaData.MatchField,SearchText:scope.searchText,selectedTagsIds:scope.selectedTagsIds}).success(function(data){var finalData=[];finalData=scope.selectedTags.length?data.filter(function(obj){return-1===scope.selectedTagsIds.indexOf(obj._id)}):data,scope.suggestions=finalData,scope.selectedIndex=-1}):delete scope.suggestions},scope.addToSelectedTags=function(index){-1!==index&&-1===scope.selectedTags.indexOf(scope.suggestions[index])&&(scope.selectedTags.push(scope.suggestions[index]),scope.selectedTagsIds.push(scope.suggestions[index]._id),scope.searchText="",scope.suggestions=[])},scope.checkKeyDown=function(event){40===event.keyCode?(event.preventDefault(),scope.selectedIndex+1!==scope.suggestions.length&&scope.selectedIndex++):38===event.keyCode?(event.preventDefault(),scope.selectedIndex-1!==-1&&scope.selectedIndex--):13===event.keyCode&&scope.addToSelectedTags(scope.selectedIndex)},scope.$watch("selectedIndex",function(val){-1!==val&&(scope.searchText=scope.suggestions[scope.selectedIndex][scope.metaData.MatchField])})}}}]),angular.module("core").directive("pvntDblClick",["$timeout",function($timeout){return{restrict:"A",transclude:!0,replace:!0,link:function($scope,elm){elm.on("click",function(){console.log("clicked"),$timeout(function(){elm.attr("disabled",!0),$timeout(function(){elm.attr("disabled",!1)},3e3)},0)})}}}]),angular.module("core").directive("sumahighchart",function(){return{restrict:"E",template:"<div></div>",scope:{chartData:"=value",chartObj:"=?"},transclude:!0,replace:!0,link:function($scope,$element,$attrs){$scope.$watch("chartData",function(value){value&&($scope.chartData.chart=$scope.chartData.chart||{},$scope.chartData.chart.renderTo=$scope.chartData.chart.renderTo||$element[0],$scope.chartObj=new Highcharts.Chart($scope.chartData))})}}}),angular.module("core").factory("AutoComplete",["$http",function($http){var AutoCompleteService={};return AutoCompleteService.getAutoCompleteData=function(req,res){return $http.post("autoComplete/getAutoCompleteData",req)},AutoCompleteService}]),angular.module("core").service("Menus",[function(){this.defaultRoles=["*"],this.menus={};var shouldRender=function(user){if(!user)return this.isPublic;if(~this.roles.indexOf("*"))return!0;for(var userRoleIndex in user.roles)for(var roleIndex in this.roles)if(this.roles[roleIndex]===user.roles[userRoleIndex])return!0;return!1};this.validateMenuExistance=function(menuId){if(menuId&&menuId.length){if(this.menus[menuId])return!0;throw new Error("Menu does not exists")}throw new Error("MenuId was not provided")},this.getMenu=function(menuId){return this.validateMenuExistance(menuId),this.menus[menuId]},this.addMenu=function(menuId,isPublic,roles){return this.menus[menuId]={isPublic:isPublic||!1,roles:roles||this.defaultRoles,items:[],shouldRender:shouldRender},this.menus[menuId]},this.removeMenu=function(menuId){this.validateMenuExistance(menuId),delete this.menus[menuId]},this.addMenuItem=function(menuId,menuItemTitle,menuItemURL,menuItemType,menuItemUIRoute,isPublic,roles,position){return this.validateMenuExistance(menuId),this.menus[menuId].items.push({title:menuItemTitle,link:menuItemURL,menuItemType:menuItemType||"item",menuItemClass:menuItemType,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].roles:roles,position:position||0,items:[],shouldRender:shouldRender}),this.menus[menuId]},this.addSubMenuItem=function(menuId,rootMenuItemURL,menuItemTitle,menuItemURL,menuItemUIRoute,isPublic,roles,position){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===rootMenuItemURL&&this.menus[menuId].items[itemIndex].items.push({title:menuItemTitle,link:menuItemURL,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].items[itemIndex].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].items[itemIndex].roles:roles,position:position||0,shouldRender:shouldRender});return this.menus[menuId]},this.removeMenuItem=function(menuId,menuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===menuItemURL&&this.menus[menuId].items.splice(itemIndex,1);return this.menus[menuId]},this.removeSubMenuItem=function(menuId,submenuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)for(var subitemIndex in this.menus[menuId].items[itemIndex].items)this.menus[menuId].items[itemIndex].items[subitemIndex].link===submenuItemURL&&this.menus[menuId].items[itemIndex].items.splice(subitemIndex,1);return this.menus[menuId]},this.addMenu("topbar")}]),angular.module("core").factory("PusherService",["$pusher",function($pusher){var PusherService={},client=new Pusher("f9ee22d1cb0b7cc349e6"),pusher=$pusher(client);return PusherService.listen=function(ChannelName,eventName,callback){pusher.subscribe(ChannelName).bind(eventName,function(data){callback(null,data)})},PusherService}]),angular.module("users").config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push(["$q","$location","Authentication",function($q,$location,Authentication){return{responseError:function(rejection){switch(rejection.status){case 401:Authentication.user=null,$location.path("signin");break;case 403:}return $q.reject(rejection)}}}])}]),angular.module("users").config(["$stateProvider",function($stateProvider){$stateProvider.state("profile",{url:"/settings/profile",templateUrl:"modules/users/views/settings/edit-profile.client.view.html"}).state("password",{url:"/settings/password",templateUrl:"modules/users/views/settings/change-password.client.view.html"}).state("accounts",{url:"/settings/accounts",templateUrl:"modules/users/views/settings/social-accounts.client.view.html"}).state("signup",{url:"/signup",templateUrl:"modules/users/views/authentication/signup.client.view.html"}).state("signin",{url:"/signin",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("forgot",{url:"/password/forgot",templateUrl:"modules/users/views/password/forgot-password.client.view.html"}).state("reset-invalid",{url:"/password/reset/invalid",templateUrl:"modules/users/views/password/reset-password-invalid.client.view.html"}).state("reset-success",{url:"/password/reset/success",templateUrl:"modules/users/views/password/reset-password-success.client.view.html"}).state("reset",{url:"/password/reset/:token",templateUrl:"modules/users/views/password/reset-password.client.view.html"})}]),angular.module("users").controller("AuthenticationController",["$scope","$http","$location","Authentication","toastr",function($scope,$http,$location,Authentication,toastr){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/companyfeeds/create"),$scope.signup=function(){$http.post("/auth/signup",$scope.credentials).success(function(response){$scope.authentication.user=response,toastr.info("You have signed up","Successfully"),$location.path("/companyfeeds/create")}).error(function(response){$scope.error=response.message})},$scope.signin=function(){$http.post("/auth/signin",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/companyfeeds/create"),toastr.success("You are successfully logged in.","done")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("PasswordController",["$scope","$stateParams","$http","$location","Authentication",function($scope,$stateParams,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.askForPasswordReset=function(){$scope.success=$scope.error=null,$http.post("/auth/forgot",$scope.credentials).success(function(response){$scope.credentials=null,$scope.success=response.message}).error(function(response){$scope.credentials=null,$scope.error=response.message})},$scope.resetUserPassword=function(){$scope.success=$scope.error=null,$http.post("/auth/reset/"+$stateParams.token,$scope.passwordDetails).success(function(response){$scope.passwordDetails=null,Authentication.user=response,$location.path("/password/reset/success")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("SettingsController",["$scope","$http","$location","Users","Authentication","toastr","$upload",function($scope,$http,$location,Users,Authentication,toastr,$upload){$scope.user=Authentication.user,$scope.uploadedImage="https://s3.amazonaws.com/sumacrm/avatars/"+Authentication.user._id;var executeOnSignedUrl=function(file,callback){var this_s3upload,xhr;return this_s3upload=this,xhr=new XMLHttpRequest,xhr.open("GET","/sign_s3?s3_object_type="+file.type+"&s3_object_name=default_name",!0),xhr.overrideMimeType("text/plain; charset=x-user-defined"),xhr.onreadystatechange=function(e){var result;if(4===this.readyState&&200===this.status){try{result=JSON.parse(this.responseText)}catch(error){return this_s3upload.onError('Signing server returned some ugly/empty JSON: "'+this.responseText+'"'),!1}return callback(result.signed_request,result.url)}return 4===this.readyState&&200!==this.status?this_s3upload.onError("Could not contact request signing server. Status = "+this.status):void 0},xhr.send()},createCORSRequest=function(method,url){var xhr;return xhr=new XMLHttpRequest,null!==xhr.withCredentials?xhr.open(method,url,!0):"undefined"!=typeof XDomainRequest?(xhr=new XDomainRequest,xhr.open(method,url)):xhr=null,xhr},uploadToS3=function(file,url,public_url){var this_s3upload,xhr;return this_s3upload=this,xhr=createCORSRequest("PUT",url),xhr?(xhr.onload=function(){200===xhr.status?($scope.uploadedImage=public_url,toastr.success("File Uploaded Succsessfully"),$scope.$apply(),window.location.reload()):console.log("Upload error: "+xhr.status)},xhr.onerror=function(){return this_s3upload.onError("XHR error.")},xhr.upload.onprogress=function(e){var percentLoaded;e.lengthComputable&&(percentLoaded=Math.round(e.loaded/e.total*100),$scope.uploadProgress=percentLoaded,$scope.$apply())}):this.onError("CORS not supported"),xhr.setRequestHeader("Content-Type",file.type),xhr.setRequestHeader("x-amz-acl","public-read"),xhr.send(file)},uploadFile=function(file){return executeOnSignedUrl(file,function(signedURL,publicURL){return uploadToS3(file,signedURL,publicURL)})};$scope.onFileSelect=function(image){if(image.length){if(angular.isArray(image)&&(image=image[0]),"image/png"!==image.type&&"image/jpeg"!==image.type)return void alert("Only PNG and JPEG are accepted.");$scope.uploadInProgress=!0,$scope.uploadProgress=0,$scope.test=uploadFile(image)}},$scope.user||$location.path("/"),$scope.hasConnectedAdditionalSocialAccounts=function(provider){for(var i in $scope.user.additionalProvidersData)return!0;return!1},$scope.isConnectedSocialAccount=function(provider){return $scope.user.provider===provider||$scope.user.additionalProvidersData&&$scope.user.additionalProvidersData[provider]},$scope.removeUserSocialAccount=function(provider){$scope.success=$scope.error=null,$http["delete"]("/users/accounts",{params:{provider:provider}}).success(function(response){$scope.success=!0,$scope.user=Authentication.user=response}).error(function(response){$scope.error=response.message})},$scope.updateUserProfile=function(isValid){if(isValid){$scope.success=$scope.error=null,$scope.uploadedImage&&($scope.user.isImage=!0);var user=new Users($scope.user);user.$update(function(response){$scope.success=!0,Authentication.user=response},function(response){$scope.error=response.data.message})}else $scope.submitted=!0},$scope.changeUserPassword=function(){$scope.success=$scope.error=null,$http.post("/users/password",$scope.passwordDetails).success(function(response){$scope.success=!0,$scope.passwordDetails=null,toastr.success("Your Password Change Successfully ","Done")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").directive("uiUpload",["$upload",function($upload){return{templateUrl:"meanjsapp/public/modules/users/views/settings/uploadImage.html",scope:{fileDest:"=",filename:"=",uploadCallback:"&",uploadFileCallback:"&"},restrict:"E",replace:!1,link:function($scope,element,attrs){$scope.onFileSelect=function($files){var files=[];$scope.files=$files;var file=$files[0];console.log(file),$scope.upload=$upload.upload({url:"fileUpload/upload",headers:{"Content-Type":"multipart/form-data"},data:{dest:$scope.fileDest,filename:$scope.filename},file:file}).progress(function(evt){console.log("percent: "+parseInt(100*evt.loaded/evt.total))}).success(function(data,status,headers,config){data.success&&(angular.isDefined(attrs.uploadFileCallback)&&$scope.uploadFileCallback({file:data.file}),files.push(data.file)),files.length===$files.length&&angular.isDefined(attrs.uploadCallback)&&$scope.uploadCallback({files:files})})}}}}]),angular.module("users").factory("Authentication",[function(){var _this=this;return _this._data={user:window.user},_this._data}]),angular.module("users").factory("Users",["$resource",function($resource){return $resource("users",{},{update:{method:"PUT"}})}]);