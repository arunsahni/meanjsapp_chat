/**
 * Created by arunsahni on 4/21/15.
 */
'use strict';

// Admins controller
angular.module('admins').controller('FeaturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admins', 'Menus',
    function($scope, $stateParams, $location, Authentication, Admins, Menus) {

        $scope.authentication = Authentication;
        $scope.isActive = true;
        $scope.showFeature = false;

        $scope.disbledfeatures = [];
        $scope.featureList = [];

        $scope.NotAccessblefeatures = ['grp.sadm','grp.lgrp','grp.ngp'];
        $scope.featureFlags = [
            {
                title: 'admin.adm',
                isEnable: true,
                type: 'M'
            },
            {
                title: 'admin.rmgt',
                isEnable: true,
                type: 'S'
            },
            {
                title: 'admin.accmgt',
                isEnable: true,
                type: 'S'
            },
            {
                title: 'acc.sub.das',
                isEnable: true,
                type: 'M'
            },
            {
                title: 'acc.sub.art',
                isEnable: true,
                type: 'M'
            },
            {
                title: 'acc.sub.item',
                isEnable: true,
                type: 'S'
            },
            {
                title: 'acc.sub.new',
                isEnable: true,
                type: 'S'
            },
            {
                title: 'grp.sadm',
                isEnable: true,
                type: 'M'
            },
            {
                title: 'grp.lgrp',
                isEnable: true,
                type: 'S'
            },
            {
                title: 'grp.ngp',
                isEnable: true,
                type: 'S'
            }
        ];

        var checkAccess = function() {
            if(Authentication.user.roles[0] !== 'superadmin') {
                angular.forEach($scope.featureFlags, function(item){
                    if($scope.NotAccessblefeatures.indexOf(item.title) === -1) {
                        $scope.featureList.push(item);
                    }
                });
            } else {
                $scope.featureList = $scope.featureFlags;
            }
        };

        // Intialize directive
        $scope.autoCompleteData = {
            EntityName: ['User'],
            Projection: ['firstName', '_id', 'isImage', 'disbledfeatures'],
            MatchField: 'firstName'
        };

        var getFeatureFlags = function(disbledfeatures) {
            if (disbledfeatures.length) {
                angular.forEach($scope.featureFlags, function(item){
                    if(disbledfeatures.indexOf(item.title) !== -1) {
                        item.isEnable = false;
                    }
                });
            }
        };

        // To watch directive scope
        $scope.$watchCollection('data.tags',function(){
            if ($scope.data && $scope.data.tags.length) {
                $scope.showFeature = true;
                getFeatureFlags($scope.data.tags[0].disbledfeatures);
                checkAccess();
            } else {
                $scope.showFeature = false;
            }
        });

        // For User list
        $scope.initFeatures = function() {
            $scope.featuresList = Menus.getMenu('topbar').items;
        };

        $scope.toggleFeature = function(active, features, index) {
            if(active === true) {
                var obj={
                    userId: $scope.data.tags[0]._id,
                    itemtoPop: features.title
                };
                Admins.popAccess(obj).success(function(user){
                });
            } else {
                $scope.disbledfeatures.push(features.title);
                $scope.data.disbledfeatures = features.title;
                Admins.pushAccess($scope.data).success(function(user){
                });
            }
            $scope.featureFlags[index].isEnable = active;
        };
    }
]);
