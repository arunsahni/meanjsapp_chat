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
