'use strict';

angular.module('tasks').directive('rangeSlider', function($document) {
    return {
        restrict: 'A',
        scope: {
            model: '='
        },
        replace: true,
        templateUrl: '/modules/tasks/views/range.progress.client.view.html',
        link: function(scope, element, attrs) {
            var moveHandle, percentage, setPercentage, sliderHandleWidth;

            var options = scope.$eval(attrs.rangeSliderOptions) || {};
            scope.step = options.step || 5;
            scope.min = options.min || 0;
            scope.max = options.max || 100;
            scope.label = options.label || '';
            scope.valuePrefix = options.valuePrefix || '';
            scope.valueSuffix = options.valueSuffix || '';

            percentage = 0;
            scope.displayValue = scope.model;
            sliderHandleWidth = element[0].querySelector('.slider-handle').clientWidth;

            if (scope.model === null)
                scope.model = 0;

            moveHandle = function() {
                return scope.$evalAsync(function() {
                    scope.highlightStyle = { 'right': (100 - percentage * 100) + '%' };
                    scope.handleStyle = { 'left': (percentage * 100) + '%' };
                    return scope.handleStyle;
                });
            };

            setPercentage = function() {
                percentage = scope.model / scope.max;
                return percentage;
            };

            scope.engageHandle = function(event) {
                var basePercentage, basePosition, mouseMove, mouseUp;
                event.preventDefault();
                basePosition = event.screenX;
                basePercentage = percentage;

                mouseMove = function(event) {
                    basePercentage = 0;
                    percentage = basePercentage + (event.screenX - basePosition) / (element.prop('clientWidth') - sliderHandleWidth);
                    if (percentage < 0)
                        percentage = 0;

                    if (percentage > 1)
                        percentage = 1;

                    scope.displayValue = Math.round(scope.max * percentage / scope.step) * scope.step;
                    return moveHandle();
                };

                mouseUp = function() {
                    $document.off('mousemove', mouseMove);
                    $document.off('mouseup', mouseUp);
                    scope.model = scope.displayValue;
                    setPercentage();
                    return moveHandle();
                };

                $document.on('mousemove', mouseMove);
                $document.on('mouseup', mouseUp);
            };

            setPercentage();
            moveHandle();

            return scope.$watch('model', function(newValue, oldValue, scope) {
                scope.displayValue = newValue;
                setPercentage();
                return moveHandle();
            });
        }
    };
});
