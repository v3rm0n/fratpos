(function (angular) {
	"use strict";

	var app = angular.module('fratis', ['common', 'ngRoute', 'ngResource', 'ui.bootstrap', 'ui.select', 'ngSanitize', 'angularMoment'])
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider
				.when('/:page', {
					templateUrl: function (params) {
						return "admin/" + params.page;
					}
				})
				.when('/profile/:id', {templateUrl: "/admin/profile"})
				.when('/stocktaking/:id', {templateUrl: "/admin/stocktaking", controller: "StocktakingViewController"})
				.otherwise({redirectTo: "/users"});
		}]);

	//Nice looking checkboxes and radio buttons
	app.directive('icheck', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				model: '=ngModel'
			},
			link: function ($scope, element, $attrs, ngModel) {
				return $timeout(function () {
					var value;
					value = $attrs.value;

					$scope.$watch($attrs.ngModel, function (newValue) {
						angular.element(element).iCheck('update');
					});

					return angular.element(element).iCheck({
						checkboxClass: 'icheckbox_flat-yellow',
						radioClass: 'iradio_flat-yellow'
					}).on('ifChanged', function (event) {
						if (angular.element(element).attr('type') === 'checkbox' && $attrs.ngModel) {
							$scope.$apply(function () {
								return ngModel.$setViewValue(event.target.checked);
							});
						}
						if (angular.element(element).attr('type') === 'radio' && $attrs.ngModel) {
							return $scope.$apply(function () {
								return ngModel.$setViewValue(value);
							});
						}
					});
				});
			}
		};
	}]);

	app.directive('inputmaskdate', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			link: function ($scope, element) {
				return $timeout(function () {
					return angular.element(element).inputmask('dd/mm/yyyy', {
						placeholder: 'pp/kk/aaaa'
					});
				});
			}
		};
	}]);

}(window.angular));
