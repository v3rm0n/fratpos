(function (angular, Chart) {
	"use strict";

	var app = angular.module('fratpos', ['ui.bootstrap', 'common']);

	//Focuses an input element after rendering
	app.directive('focusMe', function ($timeout) {
		return {
			link: function (scope, element) {
				$timeout(function () {
					element[0].focus();
				});
			}
		};
	});

	//Draws a doughnut chart on canvas
	app.directive('doughnutChart', function () {
		return {
			link: function (scope, element, attrs) {
				scope.$watch(attrs.doughnutChart, function (value) {
					if (value) {
						var ctx = element[0].getContext("2d");
						var config = {
							data: value
						};
						Chart.Doughnut(ctx, config);
					}
				});
			}
		};
	});

	app.directive("scrollToViewWhen", function ($timeout) {
		return {
			link: function (scope, element, attrs) {
				scope.$on(attrs.scrollToViewWhen, function () {
					$timeout(function () {
						angular.element(element)[0].scrollIntoView();
					});
				});
			}
		};
	});

}(window.angular, window.Chart));
