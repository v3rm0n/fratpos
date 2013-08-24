/*jslint es5: true nomen: true forin: true vars: true*/
(function (global) {
    "use strict";

    //Main module
    var app = global.angular.module('fratpos', ['ui.bootstrap'])
        .config(function ($routeProvider) {
            $routeProvider
                .when('/users', {templateUrl: "/admin/users"})
                .when('/transactions', {templateUrl: "/admin/transactions"})
                .when('/products', {templateUrl: "/admin/products"})
                .when('/paytypes', {templateUrl: "/admin/paytypes"})
                .when('/statuses', {templateUrl: "/admin/statuses"})
                .when('/stocktakings', {templateUrl: "/admin/stocktakings"})
                .otherwise({redirectTo: "/users"});
        });

    //Directives

    //Nice toggle for boolean values
    app.directive('toggle', function () {
        return {
            restrict: 'E',
            replace:  true,
            require:  'ngModel',
            template: '<div class="toggle toggle-icon">\
                        <label class="toggle-radio fui-checkmark-16"></label>\
                        <label class="toggle-radio fui-cross-16"></label>\
                      </div>',
            link:  function (scope, element, attributes, ngModelCtrl) {
                var inactiveClass = 'toggle-off';

                scope.$watch(function () {
                    return ngModelCtrl.$modelValue;
                }, function (modelValue) {
                    if (modelValue) {
                        element.removeClass(inactiveClass);
                    } else {
                        element.addClass(inactiveClass);
                    }
                });

                element.bind('click', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.hasClass(inactiveClass));
                    });
                });
            }
        };
    });

    //Pretty checkboxes
    app.directive('checkbox', function () {
        return {
            restrict: 'E',
            replace:  true,
            transclude: true,
            require:  'ngModel',
            template: '<label class="checkbox">\
                        <span class="icon"></span><span class="icon-to-fade"></span>\
                        <div ng-transclude></div>\
                      </label>',
            link: function (scope, element, attributes, ngModelCtrl) {
                var activeClass = 'checked';

                scope.$watch(function () {
                    return ngModelCtrl.$modelValue;
                }, function (modelValue) {
                    if (modelValue) {
                        element.addClass(activeClass);
                    } else {
                        element.removeClass(activeClass);
                    }
                });

                element.bind('click', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(!element.hasClass(activeClass));
                    });
                });
            }
        };
    });

    app.factory('api', function ($http, $window, $rootScope, $timeout) {
        return {
            posdata: function (callback) {
                $http.get('/posdata').success(callback);
            },
            transaction: function (data, callback) {
                $http.post('/transaction', data).success(callback);
            },
            invalid: function (transaction, password, callback) {
                if (typeof (password) === 'function') {
                    callback = password;
                    password = undefined;
                }
                $http.post('/transaction/invalid', {id: transaction._id, password: password}).success(callback);
            }
        };
    });

}(this));