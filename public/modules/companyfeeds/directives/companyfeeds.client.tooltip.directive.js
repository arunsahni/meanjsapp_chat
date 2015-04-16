/**
 * Created by sumasoft on 4/14/15.
 */
'use strict';

angular.module('companyfeeds').directive('toggle', function($tooltip){
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
});
