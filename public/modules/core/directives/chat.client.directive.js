/**
 * Created by sumasoft on 5/14/15.
 */
'use strict';
angular.module('core').directive('menu', function() {
    return {
        restrict: 'E',
        template: '<div ng-class="{ show: visible, left: alignment === \'left\', right: alignment === \'right\' }" ng-transclude></div>',
        transclude: true,
        scope: {
            visible: '=',
            alignment: '@'
        }
    };
});

angular.module('core').directive('menuItem', function() {
    return {
        restrict: 'E',
        template: '<div ng-click="openChatBox()" ng-transclude style="margin-left: 2px"></div>',
        transclude: true,
        scope: {
            hash: '@'
        },
        link: function($scope) {
            $scope.openChatBox = function() {
                //window.alert($scope.hash);
            };
        }
    };
});

