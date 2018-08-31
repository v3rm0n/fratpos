/*jslint es5: true nomen: true forin: true vars: true*/
(function (angular, $, Chart) {
    "use strict";

    //Main module
    var app = angular.module('fratpos', ['ngRoute', 'mgcrea.ngStrap', 'ngResource'])
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');
            $routeProvider
                .when('/users', {templateUrl: "/admin/users"})
                .when('/transactions', {templateUrl: "/admin/transactions"})
                .when('/transactions', {templateUrl: "/admin/transactions"})
                .when('/products', {templateUrl: "/admin/products"})
                .when('/paytypes', {templateUrl: "/admin/paytypes"})
                .when('/statuses', {templateUrl: "/admin/statuses"})
                .when('/stocktakings', {templateUrl: "/admin/stocktakings"})
                .when('/stocktaking/:id', {templateUrl: "/admin/stocktaking", controller: "StocktakingViewController"})
                .when('/feedback', {templateUrl: "/admin/feedback"})
                .otherwise({redirectTo: "/users"});
        }]);

    //Nice looking checkboxes and radio buttons
    app.directive('icheck', ['$timeout', function ($timeout) {
        return {
            require: 'ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var value;
                    value = $attrs.value;

                    $scope.$watch($attrs.ngModel, function (newValue) {
                        $(element).iCheck('update');
                    });

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_flat',
                        radioClass: 'iradio_flat'
                    }).on('ifChanged', function (event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs.ngModel) {
                            $scope.$apply(function () {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs.ngModel) {
                            return $scope.$apply(function () {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    }]);

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
    app.directive('doughnutChart', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.doughnutChart, function (value) {
                    if (value) {
                        var ctx = element[0].getContext("2d");
                        new Chart(ctx).Doughnut(value);
                    }
                });
            }
        };
    });

    app.directive("scrollToViewWhen", function ($timeout) {
        return {
            link: function(scope, element, attrs) {
                scope.$on(attrs.scrollToViewWhen, function () {
                    $timeout(function () {
                        angular.element(element)[0].scrollIntoView();
                    });
                });
            }
        };
    });

    //Backend API
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

}(angular, jQuery, Chart));
