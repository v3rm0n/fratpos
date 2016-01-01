(function (angular, toastr, swal) {
	"use strict";

	var app = angular.module('common', ['restangular']);

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

	app.config(function (RestangularProvider) {
		RestangularProvider.addElementTransformer('transactions', false, function (transaction) {
			// signature is (name, operation, path, params, headers, elementToPost)
			transaction.addRestangularMethod('invalidate', 'post', 'invalid');
			return transaction;
		});
	});

	var createResource = function (Restangular, path) {
		var resource = Restangular.all(path);
		resource.create = function () {
			return Restangular.restangularizeElement(undefined, {}, path);
		};
		return resource;
	};

	app.factory('api', function ($http, Restangular) {
		var resources = {
			stat: function (user) {
				return $http.get('/stat/' + user.id);
			},
			Me: Restangular.oneUrl('users', '/users/me'),
			Users: createResource(Restangular, 'users'),
			Products: createResource(Restangular, 'products'),
			Statuses: createResource(Restangular, 'statuses'),
			Paytypes: createResource(Restangular, 'paytypes'),
			Transactions: createResource(Restangular, 'transactions'),
			Feedbacks: createResource(Restangular, 'feedbacks'),
			Stocktakings: createResource(Restangular, 'stocktakings'),
			Roles: createResource(Restangular, 'roles'),
			Permissions: createResource(Restangular, 'permissions'),
			Incomes: createResource(Restangular, 'incomes'),
			IncomeTypes: createResource(Restangular, 'incometypes'),
			Obligations: createResource(Restangular, 'obligations'),
			ObligationTypes: createResource(Restangular, 'obligationtypes')
		};
		Restangular.extendModel('users', function (user) {
			user.addRole = function (role) {
				return user.one('roles', role.id).save();
			};
			user.removeRole = function (role) {
				return user.one('roles', role.id).remove();
			};
			user.addProfile = function (profile) {
				return user.all('profile').post(profile);
			};
			user.updateProfile = function (profile) {
				return Restangular.restangularizeElement(user, profile, 'profile').put();
			};
			user.addObligation = function (userObligation) {
				return Restangular.restangularizeElement(user, userObligation, 'obligations').post();
			};
			return user;
		});
		Restangular.extendModel('roles', function (role) {
			role.addPermission = function (permissionId) {
				return role.one('permissions', permissionId).save();
			};
			role.removePermission = function (permissionId) {
				return role.one('permissions', permissionId).remove();
			};
			return role;
		});
		return resources;
	});

}(window.angular, window.toastr, window.swal));