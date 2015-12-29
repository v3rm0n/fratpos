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

}(window.angular, window.toastr, window.swal));