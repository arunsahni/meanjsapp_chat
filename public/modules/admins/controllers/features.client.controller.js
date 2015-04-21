/**
 * Created by arunsahni on 4/21/15.
 */
'use strict';

// Admins controller
angular.module('admins').controller('FeaturesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admins', 'Menus',
    function($scope, $stateParams, $location, Authentication, Admins, Menus) {
        $scope.authentication = Authentication;
        $scope.featuresList = [];
        $scope.isActive = true;

        // For User list
        $scope.initFeatures = function() {
            $scope.featuresList = Menus.getMenu('topbar').items;
            console.log($scope.featuresList);
        };

        $scope.PermissionChange = function() {

        };
    }
]);
