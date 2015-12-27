(function (angular, Chart) {
	"use strict";

	var app = angular.module('fratpos', ['mgcrea.ngStrap', 'ngResource']);

	app.run(function($http) {
		var token = angular.element("meta[name='_csrf']").attr("content");
		var header = angular.element("meta[name='_csrf_header']").attr("content");
		$http.defaults.headers.common[header] = token;
	});

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

	app.factory('api', function ($http, $resource) {
		return {
			posdata: function () {
				return $http.get('/posdata');
			},
			invalidate: function (transaction) {
				return $http.post('/transaction/invalid/' + transaction.id);
			},
			stat: function (user) {
				return $http.get('/stat/' + user.id);
			},
			User: $resource('/user/:id', {id: '@id'}),
			Product: $resource('/product/:id', {id: '@id'}),
			Status: $resource('/status/:id', {id: '@id'}),
			Paytype: $resource('/paytype/:id', {id: '@id'}),
			Transaction: $resource('/transaction/:id', {id: '@id'}, {
				invalidate: {url: '/transaction/invalid/:id', method: 'POST'}
			}),
			Feedback: $resource('/feedback/:id', {id: '@id'}),
			Stocktaking: $resource('/stocktaking/:id', {id: '@id'})
		};
	});

}(window.angular, window.Chart));
