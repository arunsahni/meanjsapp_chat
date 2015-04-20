'use strict';

angular.module('core').directive('pvntDblClick', function ($timeout) {
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
});
