/**
 * Created by sumasoft on 4/14/15.
 */
'use strict';

angular.module('companyfeeds').directive('toggle', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs,$){
            if (attrs.toggle === 'tooltip'){
                $(element).tooltip();
            }
            /*if (attrs.toggle === 'popover'){
                $(element).popover();
            }*/
        }
    };
});
