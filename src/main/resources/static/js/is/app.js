(function (angular, toastr, swal) {
	"use strict";

	var app = angular.module('fratis', ['ngRoute', 'ngResource', 'mgcrea.ngStrap', 'ui.bootstrap.pagination', 'ui.bootstrap.tpls'])
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider
				.when('/:page', {
					templateUrl: function (params) {
						return "admin/" + params.page;
					}
				})
				.when('/stocktaking/:id', {templateUrl: "/admin/stocktaking", controller: "StocktakingViewController"})
				.otherwise({redirectTo: "/users"});
		}]);

	app.run(function ($http) {
		var token = angular.element("meta[name='_csrf']").attr("content");
		var header = angular.element("meta[name='_csrf_header']").attr("content");
		$http.defaults.headers.common[header] = token;
	});

	app.factory('notify', function () {
		toastr.options = {
			"positionClass": "toast-bottom-right",
			"preventDuplicates": true,
			"timeOut": "2000"
		};
		return {
			warning: function (config, success) {
				var defaults = {
					type: 'warning',
					showCancelButton: true,
					cancelButtonText: "Katkesta",
					confirmButtonClass: "btn-warning",
					confirmButtonText: "Jah!"
				};
				angular.extend(defaults, config);
				swal(defaults, success);
			},
			success: function (text) {
				toastr.success(text);
			},
			error: function (text) {
				toastr.error(text);
			}
		};
	});

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

	app.directive('select2', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			link: function ($scope, element, attrs) {
				var refreshSelect = function () {
					$timeout(function () {
						element.trigger('change');
					});
				};
				$scope.$watch(attrs.ngModel, refreshSelect);
				return $timeout(function () {
					return angular.element(element).select2();
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
						placeholder: 'pp/kk/aaaa', autoUnmask: true, onUnMask: function (maskedValue) {
							var date = maskedValue.split('/');
							return date[2] + '-' + date[1] + '-' + date[0];
						}
					});
				});
			}
		};
	}]);

	app.factory('api', function ($http, $resource) {
		return {
			User: $resource('/user/:id', {id: '@id'}, {
				me: {url: '/user/me', method: 'GET'},
				addRole: {
					url: '/user/:id/role/:roleId',
					params: {id: '@id', roleId: '@roleId'},
					method: 'PUT'
				},
				removeRole: {
					url: '/user/:id/role/:roleId',
					params: {id: '@id', roleId: '@roleId'},
					method: 'DELETE'
				}
			}),
			Product: $resource('/product/:id', {id: '@id'}),
			Status: $resource('/status/:id', {id: '@id'}),
			Paytype: $resource('/paytype/:id', {id: '@id'}),
			Transaction: $resource('/transaction/:id', {id: '@id'}, {
				invalidate: {url: '/transaction/invalid/:id', method: 'POST'}
			}),
			Feedback: $resource('/feedback/:id', {id: '@id'}),
			Stocktaking: $resource('/stocktaking/:id', {id: '@id'}),
			Role: $resource('/role/:id', {id: '@id'}, {
				addPermission: {
					url: '/role/:id/permission/:permissionId',
					params: {id: '@id', permissionId: '@permissionId'},
					method: 'PUT'
				},
				removePermission: {
					url: '/role/:id/permission/:permissionId',
					params: {id: '@id', permissionId: '@permissionId'},
					method: 'DELETE'
				}
			}),
			Permission: $resource('/permission/:id', {id: '@id'}),
			Income: $resource('/income/:id', {id: '@id'}),
			IncomeType: $resource('/incometype/:id', {id: '@id'})
		};
	});

}(window.angular, window.toastr, window.swal));
