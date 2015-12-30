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

	app.directive('periodpicker', ['moment', '$parse', function (moment) {
		return {
			scope: {
				periodStart: '=periodStart',
				periodEnd: '=periodEnd'
			},
			link: function ($scope, element) {
				return angular.element(element).daterangepicker(
					{
						format: 'DD/MM/YYYY',
						locale: {
							applyLabel: 'OK',
							cancelLabel: 'Katkesta',
							fromLabel: 'Alates',
							toLabel: 'Kuni',
							weekLabel: 'N',
							customRangeLabel: 'Täpsusta',
							daysOfWeek: moment.weekdaysMin(),
							monthNames: moment.monthsShort(),
							firstDay: moment.localeData()._week.dow
						},
						ranges: {
							'Kolm kuud': [moment(), moment().add(3, 'months')],
							'Pool aastat': [moment(), moment().add(6, 'months')],
							'Aasta': [moment(), moment().add(1, 'year')],
							'Kaks aastat': [moment(), moment().add(2, 'years')],
							'Viis aastat': [moment(), moment().add(5, 'years')]
						}
					},
					function (start, end) {
						$scope.$apply(function () {
							$scope.periodStart = start;
							$scope.periodEnd = end;
						});

					}
				);
			}
		};
	}]);

}(window.angular));
