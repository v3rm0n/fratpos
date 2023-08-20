/*jslint es5: true nomen: true forin: true vars: true*/
(function (angular) {
    "use strict";

    const app = angular.module('fratpos');

    app.controller('PosController', function ($scope, api, $timeout, $modal) {

        const getData = function () {
            return api.posdata().then(function (response) {
                $scope.users = response.data.users;
                $scope.transactions = response.data.transactions;
                $scope.products = response.data.products;
                $scope.paytypes = response.data.paytypes;
            });
        };

        getData();

        //Update data when browser comes back online.
        $scope.$on('online', getData);

        $scope.isUserSelected = function () {
            console.dir($scope.user);
            return angular.isObject($scope.user);
        };

        $scope.clear = function () {
            $scope.user = null;
            $timeout(function () {
                angular.element('#usernotselected').focus();
            });
        };

        $scope.selectedProducts = {};

        $scope.showAllProducts = false;

        $scope.toggleShowAllProducts = function () {
            $scope.showAllProducts = !$scope.showAllProducts;
        };

        $scope.filteredProducts = function () {
            if ($scope.showAllProducts || $scope.products === undefined) {
                return $scope.products;
            }
            return $scope.products.filter(function (product) { return product.quantity > 0; });
        };

        $scope.haveZeroQuantity = function () {
            if ($scope.products === undefined) {
                return false;
            }
            return $scope.products.some(function (product) { return product.quantity <= 0; });
        };

        $scope.changeQuantity = function (product, quantity) {
            let selectedProduct = $scope.selectedProducts[product.id];
            if (selectedProduct === undefined) {
                selectedProduct = angular.copy(product);
                selectedProduct.quantity = 0;
                $scope.selectedProducts[product.id] = selectedProduct;
            }
            const newQuantity = selectedProduct.quantity + quantity;
            if (newQuantity > 0) {
                selectedProduct.quantity = newQuantity;
            } else {
                delete $scope.selectedProducts[product.id];
            }
        };

        $scope.quantity = function (product) {
            let qty = 0;
            const selectedProduct = $scope.selectedProducts[product.id];
            if (selectedProduct) {
                qty = selectedProduct.quantity;
            }
            return ' ' + qty + ' ';
        };

        $scope.sum = function () {
            let sum = 0, id;
            for (id in $scope.selectedProducts) {
                const product = $scope.selectedProducts[id];
                sum += product.price * product.quantity;
            }
            return sum;
        };

        $scope.isDisabled = function (paytype) {
            if ($scope.user) {
                let i, status;
                for (i = 0; i < paytype.allowedForStatus.length; i += 1) {
                    status = paytype.allowedForStatus[i];
                    if ($scope.user.status !== undefined && status.name === $scope.user.status.name) {
                        return false;
                    }
                }
            }
            return true;
        };

        const updateStatus = function (message, error) {
            $scope.statusMessage = message;
            $scope.status = error ? 'Viga!' : 'Korras!';
            $scope.statusError = error;
            $timeout(function () {
                $scope.status = undefined;
            }, 1000);
        };

        const productsArray = function (products) {
            let arr = [], p;
            for (p in products) {
                var product = products[p];
                var transactionProduct = angular.copy(product);
                transactionProduct.product = product;
                transactionProduct.id = null;
                arr.push(transactionProduct);
            }
            return arr;
        };

        $scope.pay = function (paytype) {
            const isEmpty = function (o) {
                let i;
                for (i in o) {
                    if (Object.prototype.hasOwnProperty.call(o, i)) {
                        return false;
                    }
                }
                return true;
            };
            if (!isEmpty($scope.selectedProducts) && $scope.user !== undefined) {
                const transaction = new api.Transaction({
                    products: productsArray($scope.selectedProducts),
                    paytype: paytype,
                    user: $scope.user
                });
                transaction.$save(function () {
                    updateStatus('Tooted läksid edukalt kirja!', false);
                    $scope.user = null;
                    $scope.selectedProducts = {};
                    getData();
                    $scope.$broadcast("paid");
                });

            } else {
                updateStatus('Palun vali toode ja kasutaja enne maksmist', true);
            }
        };

        $scope.showAllTransactions = false;

        $scope.toggleTransactions = function (show) {
            $scope.showAllTransactions = show;
        };

        $scope.filteredTransactions = function () {
            const transactions = $scope.transactions || [];
            if ($scope.showAllTransactions || transactions.length <= 5) {
                return transactions;
            } else {
                return transactions.slice(0, 5);
            }
        };

        $scope.openFeedbackDialog = function () {

            const modalScope = $scope.$new();
            modalScope.feedback = new api.Feedback();

            const d = $modal({
                templateUrl: '/dialog/feedback',
                scope: modalScope
            });

            modalScope.save = function (feedback) {
                feedback.$save(function () {
                    modalScope.error = false;
                    updateStatus('Tagasiside edastatud!', false);
                    d.hide();
                }, function () {
                    modalScope.error = true;
                });
            };
        };

        $scope.openInfoDialog = function (user) {

            const modalScope = $scope.$new();
            modalScope.user = user;

            const d = $modal({
                templateUrl: '/dialog/info',
                scope: modalScope
            });

            api.stat(user).then(function (response) {
                const stat = response.data;
                modalScope.stat = stat;
                const colors = ['#4A89DC', '#37BC9B', '#3BAFDA', '#DA4453', '#8CC152', '#434A54', '#E9573F', '#D770AD', '#967ADC', '#F6BB42'];
                modalScope.colors = colors;

                let data = [], i;

                for (i = 0; (i < 10) && (i < stat.popularProducts.length); i += 1) {
                    data.push({value: stat.popularProducts[i].count, color: colors[i]});
                }

                modalScope.chartdata = data;
            });

        };

        $scope.openTransactionDialog = function (transaction) {

            const modalScope = $scope.$new();
            modalScope.transaction = transaction;

            const d = $modal({
                templateUrl: '/dialog/transaction',
                scope: modalScope
            });

            modalScope.invalidate = function (transaction) {
                api.invalidate(transaction).then(function () {
                    getData();
                    $scope.user = null;
                    $scope.selectedProducts = {};
                    d.hide();
                });
            };
        };
    });

    app.controller('NavController', function ($scope, $location) {
        $scope.isActive = function (page) {
            return $location.path() === '/' + page;
        };
    });

    app.controller('UsersController', function ($scope, $modal, $window, api) {

        $scope.users = api.User.query();

        $scope.filteredUsers = function () {
            let users = $scope.users;
            if ($scope.filter !== undefined && $scope.filter.length > 0) {
                users = users.filter(function (user) {return user.label.toLowerCase().indexOf($scope.filter.toLowerCase()) !== -1; });
            }
            if ($scope.sortfield !== undefined) {
                const sort = function (a, b) {
                    if ($scope.asc) {
                        return String(a[$scope.sortfield]).localeCompare(b[$scope.sortfield]);
                    } else {
                        return String(b[$scope.sortfield]).localeCompare(a[$scope.sortfield]);
                    }
                };
                users = users.sort(sort);
            }
            return users;
        };

        $scope.asc = true;

        $scope.sort = function (sortfield) {
            if ($scope.sortfield === sortfield) {
                $scope.asc = !$scope.asc;
            }
            $scope.sortfield = sortfield;
        };

        $scope.totalBalance = function () {
            const users = $scope.filteredUsers();
            if (users !== undefined) {
                return users.reduce(function (sum, user) { return sum + user.balance; }, 0);
            }
            return 0;
        };

        $scope.openUserDialog = function (user) {

            api.Status.query(function (statuses) {

                const modalScope = $scope.$new();
                modalScope.user = angular.copy(user) || new api.User();
                modalScope.statuses = statuses;

                let i;
                for (i = 0; i < statuses.length; i += 1) {
                    if (modalScope.user.status === undefined || (user && statuses[i].id === user.status.id)) {
                        modalScope.user.status = statuses[i];
                        break;
                    }
                }

                const d = $modal({
                    templateUrl: '/dialog/user',
                    scope: modalScope
                });

                modalScope.save = function (user) {
                    user.$save(function () {
                        modalScope.error = false;
                        api.User.query(function (users) {
                            $scope.users = users;
                        });
                        d.hide();
                    }, function () {
                        modalScope.error = true;
                    });
                };

                modalScope.delete = function (user) {
                    const confirmed = $window.confirm('Oled kindel, et tahad kasutaja kustutada?');
                    if (confirmed) {
                        user.$remove(function () {
                            $scope.users = $scope.users.filter(function (u) {return user.id !== u.id; });
                            d.hide();
                        }, function () {
                            modalScope.error = true;
                        });
                    }
                };

            });
        };
    });

    app.controller('TransactionsController', function ($scope, api, $modal) {

        $scope.transactions = api.Transaction.query();

        $scope.totalSum = function () {
            const transactions = $scope.transactions;
            if (transactions !== undefined) {
                return transactions.reduce(function (sum, transaction) {
                    if (!transaction.invalid) {
                        return sum + transaction.sum;
                    }
                    return sum;
                }, 0);
            }
            return 0;
        };

        $scope.openDialog = function (transaction) {

            const modalScope = $scope.$new();
            modalScope.transaction = transaction;

            const d = $modal({
                templateUrl: '/dialog/transaction',
                scope: modalScope
            });

            modalScope.invalidate = function (transaction) {
                transaction.$invalidate(function () {
                    transaction.invalid = true;
                    d.hide();
                });
            };
        };
    });

    app.controller('ProductsController', function ($scope, api, $modal, $window) {

        $scope.products = api.Product.query();

        $scope.totalProducts = function () {
            if ($scope.products !== undefined) {
                return $scope.products.reduce(function (sum, product) { return sum + product.quantity; }, 0);
            }
            return 0;
        };

        $scope.sortedProducts = function () {
            let products = $scope.products;
            if ($scope.sortfield !== undefined) {
                const sort = function (a, b) {
                    if ($scope.asc) {
                        return String(a[$scope.sortfield]).localeCompare(b[$scope.sortfield]);
                    } else {
                        return String(b[$scope.sortfield]).localeCompare(a[$scope.sortfield]);
                    }
                };
                products = products.sort(sort);
            }
            return products;
        };

        $scope.asc = true;

        $scope.sort = function (sortfield) {
            if ($scope.sortfield === sortfield) {
                $scope.asc = !$scope.asc;
            }
            $scope.sortfield = sortfield;
        };

        $scope.openProductDialog = function (product) {

            const modalScope = $scope.$new();
            modalScope.product = angular.copy(product) || new api.Product();

            const d = $modal({
                templateUrl: '/dialog/product',
                scope: modalScope
            });

            modalScope.save = function (product) {
                product.$save(function (data) {
                    modalScope.error = false;
                    $scope.products = api.Product.query();
                    d.hide();
                }, function () {
                    modalScope.error = true;
                });
            };

            modalScope.delete = function (product) {
                const confirmed = $window.confirm('Oled kindel, et tahad toote kustutada?');
                if (confirmed) {
                    product.$remove(function () {
                        $scope.products = $scope.products.filter(function (u) {return product.id !== u.id; });
                        d.hide();
                    }, function () {
                        modalScope.error = true;
                    });
                }
            };

        };
    });

    app.controller('PaytypesController', function ($scope, api, $modal, $window) {

        $scope.paytypes = api.Paytype.query();

        $scope.openPaytypeDialog = function (paytype) {
            api.Status.query(function (statuses) {

                const modalScope = $scope.$new();
                modalScope.paytype = angular.copy(paytype) || new api.Paytype();
                modalScope.statuses = statuses;
                modalScope.checked = {};
                modalScope.allowedForStatus = {};

                if (paytype !== undefined) {
                    paytype.allowedForStatus.forEach(function (status) {
                        modalScope.allowedForStatus[status.id] = true;
                    });
                }

                const d = $modal({
                    templateUrl: '/dialog/paytype',
                    scope: modalScope
                });

                modalScope.save = function (p) {
                    if (p !== undefined) {
                        p.allowedForStatus = [];
                        var selected, i;
                        for (selected in modalScope.allowedForStatus) {
                            if (modalScope.allowedForStatus[selected]) {
                                for (i = 0; i < statuses.length; i += 1) {
                                    var status = statuses[i];
                                    if (status.id === parseInt(selected, 10)) {
                                        p.allowedForStatus.push(status);
                                    }
                                }
                            }
                        }
                    }
                    p.$save(function (data) {
                        modalScope.error = false;
                        $scope.paytypes = api.Paytype.query();
                        d.hide();
                    }, function () {
                        modalScope.error = true;
                    });
                };

                modalScope.delete = function (paytype) {
                    var confirmed = $window.confirm('Oled kindel, et tahad makseviisi kustutada?');
                    if (confirmed) {
                        paytype.$remove(function () {
                            $scope.paytypes = $scope.paytypes.filter(function (u) {return paytype.id !== u.id; });
                            d.hide();
                        }, function () {
                            modalScope.error = true;
                        });
                    }
                };

            });
        };

        $scope.statuses = function (paytype) {
            return paytype.allowedForStatus.reduce(function (prev, curr) {
                return prev + curr.name + ", ";
            }, "").slice(0, -2);
        };
    });

    app.controller('StatusesController', function ($scope, api, $modal, $window) {

        $scope.statuses = api.Status.query();

        $scope.openStatusDialog = function (status) {

            console.log(status);

            const modalScope = $scope.$new();
            modalScope.status = angular.copy(status) || new api.Status();

            const d = $modal({
                templateUrl: '/dialog/status',
                scope: modalScope
            });
            modalScope.save = function (s) {
                s.$save(function (data) {
                    modalScope.error = false;
                    $scope.statuses = api.Status.query();
                    d.hide();
                }, function () {
                    modalScope.error = true;
                });
            };
            modalScope.delete = function (status) {
                const confirmed = $window.confirm('Oled kindel, et tahad staatuse kustutada?');
                if (confirmed) {
                    status.$remove(function () {
                        $scope.statuses = $scope.statuses.filter(function (u) {return status.id !== u.id; });
                        d.hide();
                    }, function () {
                        modalScope.error = true;
                    });
                }
            };
        };
    });

    app.controller('StocktakingController', function ($scope, api, $location, $window) {

        $scope.stocktakings = api.Stocktaking.query();

        $scope.view = function (stocktaking) {
            $location.url('/stocktaking/' + stocktaking.id);
        };

        $scope.stocktaking = function () {
            const confirmed = $window.confirm('Oled kindel, et tahad teha inventuuri? Kasutajate saldod nullitakse ja tehingud eemaldatakse.');
            if (confirmed) {
                var stocktaking = new api.Stocktaking();
                stocktaking.$save(function (data) {
                    $scope.stocktakings.push(data);
                });
            }
        };
    });

    app.controller('StocktakingViewController', function ($scope, api, $location, $routeParams, $window) {

        $scope.stocktaking = api.Stocktaking.get({id: $routeParams.id});

        const previous = api.Stocktaking.get({id: $routeParams.id - 1}, function () {
            $scope.previous = previous;
        });

        $scope.back = function () {
            $location.url('/stocktakings');
        };

        $scope.download = function (stocktaking) {
            $window.open('/stocktaking/csv/' + stocktaking.id);
        };

    });

    app.controller('FeedbackController', function ($scope, api) {

        $scope.feedbacks = api.Feedback.query();

        $scope.deleteFeedback = function (feedback) {
            feedback.$remove(function () {
                $scope.feedbacks = $scope.feedbacks.filter(function (u) {return feedback.id !== u.id; });
            });
        };
    });

}(this.angular));