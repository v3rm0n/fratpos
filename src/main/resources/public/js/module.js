/*jslint es5: true nomen: true forin: true vars: true*/
(function (global) {
    "use strict";

    //Main module
    var app = global.angular.module('fratpos', ['ngRoute', 'mgcrea.ngStrap'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/users', {templateUrl: "/admin/users"})
                .when('/transactions', {templateUrl: "/admin/transactions"})
                .when('/products', {templateUrl: "/admin/products"})
                .when('/paytypes', {templateUrl: "/admin/paytypes"})
                .when('/statuses', {templateUrl: "/admin/statuses"})
                .when('/stocktakings', {templateUrl: "/admin/stocktakings"})
                .when('/stocktaking/:id', {templateUrl: "/admin/stocktaking", controller: "StocktakingViewController"})
                .when('/feedback', {templateUrl: "/admin/feedback"})
                .otherwise({redirectTo: "/users"});
        }]);

    app.directive('icheck', ['$timeout', function ($timeout) {
        return {
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_flat',
                        radioClass: 'iradio_flat'
                    }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    }]);

    app.directive('focusMe', function($timeout) {
      return {
        link: function(scope, element, attrs) {
            $timeout(function() {
                element[0].focus();
            });
        }
      };
    });

    app.factory('api', function ($http, $window, $rootScope, $timeout) {
        return {
            posdata: function (callback) {
                $http.get('/posdata').success(callback);
            },
            transaction: function (data, success, error) {
                $http.post('/transaction', data).success(success).error(error);
            },
            invalid: function (transaction, password, success, error) {
                if (typeof (password) === 'function') {
                    error = success;
                    success = password;
                    password = undefined;
                }
                $http.post('/transaction/invalid/' + transaction.id, {password: password}).success(success).error(error);
            }
        };
    });

}(this));