(function (angular, toastr, swal) {
	"use strict";

	var app = angular.module('common', []);

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

	app.factory('api', function ($http, $resource) {
		return {
			stat: function (user) {
				return $http.get('/stat/' + user.id);
			},
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
				},
				addProfile: {
					url: '/user/:id/userprofile',
					params: {id: '@id', userProfileId: '@userProfileId'},
					method: 'POST'
				},
				updateProfile: {
					url: '/user/:id/userprofile/:userProfileId',
					params: {id: '@id', userProfileId: '@userProfileId'},
					method: 'POST'
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
			IncomeType: $resource('/incometype/:id', {id: '@id'}),
			Obligation: $resource('/obligation/:id', {id: '@id'}),
			ObligationType: $resource('/obligationtype/:id', {id: '@id'})
		};
	});

}(window.angular, window.toastr, window.swal));