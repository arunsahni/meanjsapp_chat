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
