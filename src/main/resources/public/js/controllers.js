/*jslint es5: true nomen: true forin: true vars: true*/
(function (global) {
    "use strict";

    global.PosController = function ($scope, api, $timeout, $modal, $http) {

        var getData = function () {
            api.posdata(function (data) {
                $scope.users = data.users;
                $scope.transactions = data.transactions;
                $scope.products = data.products;
                $scope.paytypes = data.paytypes;
            });
        };

        getData();

        //Update data when browser comes back online.
        $scope.$on('online', getData);

        $scope.isUserSelected = function () {
            return angular.isObject($scope.user);
        };

        $scope.clear = function () {
            $scope.user = null;
            $timeout(function() {
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

        $scope.haveZeroQuantity = function() {
            if($scope.products === undefined) {
                return false;
            }
            return $scope.products.some(function (product) { return product.quantity <= 0; });
        };

        $scope.changeQuantity = function (product, quantity) {
            var selectedProduct = $scope.selectedProducts[product.id];
            if (selectedProduct === undefined) {
                selectedProduct = angular.copy(product);
                selectedProduct.quantity = 0;
                $scope.selectedProducts[product.id] = selectedProduct;
            }
            var newQuantity = selectedProduct.quantity + quantity;
            if (newQuantity > 0) {
                selectedProduct.quantity = newQuantity;
            } else {
                delete $scope.selectedProducts[product.id];
            }
        };

        $scope.quantity = function (product) {
            var qty = 0;
            var selectedProduct = $scope.selectedProducts[product.id];
            if (selectedProduct) {
                qty = selectedProduct.quantity;
            }
            return ' ' + qty + ' ';
        };

        $scope.sum = function () {
            var sum = 0, id;
            for (id in $scope.selectedProducts) {
                var product = $scope.selectedProducts[id];
                sum += product.price * product.quantity;
            }
            return sum;
        };

        $scope.isDisabled = function (paytype) {
            if ($scope.user) {
                var i, status;
                for (i = 0; i < paytype.allowedForStatus.length; i++) {
                    status = paytype.allowedForStatus[i];
                    if ($scope.user.status !== undefined && status.name === $scope.user.status.name) {
                        return false;
                    }
                }
            }
            return true;
        };

        var updateStatus = function (message, error) {
            $scope.statusMessage = message;
            $scope.status = error ? 'Viga!' : 'Korras!';
            $scope.statusError = error;
            $timeout(function () {
                $scope.status = undefined;
            }, 1000);
        };

        var productsArray = function (products) {
            var arr = [], product;
            for (product in products) {
                arr.push(products[product]);
            }
            return arr;
        };

        $scope.pay = function (paytype) {
            var isEmpty = function (o) {
                var i;
                for (i in o) {
                    if (Object.prototype.hasOwnProperty.call(o, i)) {
                        return false;
                    }
                }
                return true;
            };
            if (!isEmpty($scope.selectedProducts) && $scope.user !== undefined) {
                var data = {products: productsArray($scope.selectedProducts), paytype: paytype, user: $scope.user};
                api.transaction(data, function (data) {
                    updateStatus('Tooted läksid edukalt kirja!', false);
                    $scope.user = null;
                    $scope.selectedProducts = {};
                    getData();
                }, function (data) {
                    updateStatus('Viga tehingul: ' + data, true);
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
            var transactions = $scope.transactions || [];
            if ($scope.showAllTransactions || transactions.length <= 5) {
                return transactions;
            } else {
                return transactions.slice(0, 5);
            }
        };

        $scope.openFeedbackDialog = function (feedback) {

            var modalScope = $scope.$new();
            modalScope.feedback = feedback;

            var d = $modal({
                template: '/dialog/feedback',
                scope: modalScope
            });

            modalScope.save = function (feedback) {
                $http.post('/feedback', feedback).success(function () {
                modalScope.error = false;
                    updateStatus('Tagasiside edastatud!', false);
                    d.hide();
                }).error(function () {
                    modalScope.error = true;
                });
            };
        };

        $scope.openInfoDialog = function (user) {

            var modalScope = $scope.$new();
            modalScope.user = user;

            var d = $modal({
                template: '/dialog/info',
                scope: modalScope
            });

            d.$promise.then(function() {
                $http.get('/stat/' + user.id).success(function (stat) {
                    modalScope.stat = stat;
                    var colors = ['#4A89DC', '#37BC9B', '#3BAFDA', '#DA4453', '#8CC152', '#434A54', '#E9573F', '#D770AD', '#967ADC', '#F6BB42'];
                    modalScope.colors = colors;

                    var data = [], i;

                    for(i = 0; (i < 10) && (i < stat.popularProducts.length); i++) {
                        data.push({value: stat.popularProducts[i].count, color: colors[i]});
                    }

                    var ctx = document.getElementById("userchart").getContext("2d");
                    new Chart(ctx).Doughnut(data);
                });
            });

        };

        $scope.openTransactionDialog = function (transaction) {

            var modalScope = $scope.$new();
            modalScope.transaction = transaction;

            var d = $modal({
                template: '/dialog/transaction',
                scope: modalScope
            });

            modalScope.invalidate = function(transaction) {
                $http.post('/transaction/invalid/' + transaction.id).success(function (data) {
                    getData();
                    d.hide();
                });
            };
        };
    };

    global.NavController = function ($scope, $location) {
        $scope.isActive = function (page) {
            return $location.path() === '/' + page;
        };
    };

    global.UsersController = function ($scope, $http, $modal, $window) {

        $http.get('/user').success(function (data) {
            $scope.users = data;
        });

        $scope.filteredUsers = function () {
            var users = $scope.users;
            if ($scope.filter !== undefined && $scope.filter.length > 0) {
                users = users.filter(function (user) {return user.label.toLowerCase().indexOf($scope.filter) !== -1; });
            }
            if ($scope.sortfield !== undefined) {
                var sort = function (a, b) {
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
            var users = $scope.filteredUsers();
            if (users !== undefined) {
                return users.reduce(function (sum, user) { return sum + user.balance; }, 0);
            }
            return 0;
        };

        $scope.openUserDialog = function (user) {

            $http.get('/status').success(function (statuses) {

                var modalScope = $scope.$new();
                modalScope.user = user;
                modalScope.statuses = statuses;

                if(user !== undefined) {
                    var i;
                    for(i = 0; i < statuses.length; i++) {
                        if(statuses[i].id === user.status.id){
                            user.status = statuses[i];
                            break;
                        }
                    }
                }

                var d = $modal({
                    template: '/dialog/user',
                    scope: modalScope
                });

                modalScope.save = function (u) {
                    $http.post('/user', u).success(function (data) {
                        modalScope.error = false;
                        if (user === undefined) {
                            $scope.users.push(data);
                        }
                        d.hide();
                    }).error(function () {
                        modalScope.error = true;
                    });
                };

                modalScope.delete = function (user) {
                    var confirmed = $window.confirm('Oled kindel, et tahad kasutaja kustutada?');
                    if (confirmed) {
                        $http.delete('/user/' + user.id).success(function () {
                            $scope.users = $scope.users.filter(function (u) {return user.id !== u.id; });
                        });
                        d.hide();
                    }
                };

            });
        };
    };

    global.TransactionsController = function ($scope, $http, $modal) {
        $http.get('/transaction').success(function (data) {
            $scope.transactions = data;
        });

        $scope.totalSum = function () {
            var transactions = $scope.transactions;
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

            var modalScope = $scope.$new();
            modalScope.transaction = transaction;

            var d = $modal({
                template: '/dialog/transaction',
                scope: modalScope
            });

            modalScope.invalidate = function(transaction) {
                $http.post('/transaction/invalid/admin/' + transaction.id).success(function (data) {
                    transaction.invalid = true;
                    d.hide();
                });
            };
        };
    };

    global.ProductsController = function ($scope, $http, $modal, $window) {
        $http.get('/product').success(function (data) {
            $scope.products = data;
        });

        $scope.totalProducts = function () {
            if ($scope.products !== undefined) {
                return $scope.products.reduce(function (sum, product) { return sum + product.quantity; }, 0);
            }
            return 0;
        };

        $scope.sortedProducts = function () {
            var products = $scope.products;
            if ($scope.sortfield !== undefined) {
                var sort = function (a, b) {
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

            var modalScope = $scope.$new();
            modalScope.product = product;

            var d = $modal({
                template: '/dialog/product',
                scope: modalScope
            });

            modalScope.save = function (p) {
                $http.post('/product', p).success(function (data) {
                    modalScope.error = false;
                    if (product === undefined) {
                        $scope.products.push(data);
                    }
                    d.hide();
                }).error(function () {
                    modalScope.error = true;
                });
            };

            modalScope.delete = function (product) {
                var confirmed = $window.confirm('Oled kindel, et tahad toote kustutada?');
                if (confirmed) {
                    $http.delete('/product/' + product.id).success(function () {
                        $scope.products = $scope.products.filter(function (u) {return product.id !== u.id; });
                    });
                    d.hide();
                }
            };

        };
    };

    global.PaytypesController = function ($scope, $http, $modal, $window) {

        $http.get('/paytype').success(function (data) {
            $scope.paytypes = data;
        });

        $scope.openPaytypeDialog = function (paytype) {
            $http.get('/status').success(function (statuses) {

                var modalScope = $scope.$new();
                modalScope.paytype = paytype;
                modalScope.statuses = statuses;
                modalScope.checked = {};
                modalScope.allowedForStatus = {};

                if (paytype !== undefined) {
                modalScope.allowedForStatus
                    paytype.allowedForStatus.forEach(function (status) {
                        modalScope.allowedForStatus[status.id] = true;
                    });
                }

                var d = $modal({
                    template: '/dialog/paytype',
                    scope: modalScope
                });

                modalScope.save = function (p) {
                    if(p !== undefined) {
                        p.allowedForStatus = [];
                        var selected, i;
                        for (selected in modalScope.allowedForStatus) {
                            if (modalScope.allowedForStatus[selected]) {
                                for (i = 0; i < statuses.length; i++) {
                                    var status = statuses[i];
                                    if(status.id === parseInt(selected)){
                                        p.allowedForStatus.push(status);
                                    }
                                }
                            }
                        }
                    }
                    $http.post('/paytype', p).success(function (data) {
                        modalScope.error = false;
                        if (paytype === undefined) {
                            $scope.paytypes.push(data);
                        }
                        d.hide();
                    }).error(function (data) {
                        modalScope.error = true;
                    });
                };

                modalScope.delete = function (paytype) {
                    var confirmed = $window.confirm('Oled kindel, et tahad makseviisi kustutada?');
                    if (confirmed) {
                        $http.delete('/paytype/' + paytype.id).success(function () {
                            $scope.paytypes = $scope.paytypes.filter(function (u) {return paytype.id !== u.id; });
                            d.hide();
                        });
                    }
                };

            });
        };

        $scope.statuses = function (paytype) {
            return paytype.allowedForStatus.reduce(function(prev, curr) {
                return prev + curr.name + ", ";
            }, "").slice(0, -2);
        };
    };

    global.StatusesController = function ($scope, $http, $modal, $window) {
        $http.get('/status').success(function (data) {
            $scope.statuses = data;
        });

        $scope.openStatusDialog = function (status) {
            var modalScope = $scope.$new();
            var d = $modal({
                template: '/dialog/status',
                scope: modalScope
            });
            modalScope.status = status;
            modalScope.save = function (s) {
                $http.post('/status', s).success(function (data) {
                    modalScope.error = false;
                    if (status === undefined) {
                        $scope.statuses.push(data);
                    }
                    d.hide();
                }).error(function (data) {
                    modalScope.error = true;
                });
            };
            modalScope.delete = function (status) {
                var confirmed = $window.confirm('Oled kindel, et tahad staatuse kustutada?');
                if (confirmed) {
                    $http.delete('/status/' + status.id).success(function () {
                        $scope.statuses = $scope.statuses.filter(function (u) {return status.id !== u.id; });
                        d.hide();
                    }).error(function (data) {
                        modalScope.error = true;
                    });
                }
            };
        };
    };

    global.StocktakingController = function ($scope, $http, $location, $window) {
        $http.get('/stocktaking').success(function (data) {
            $scope.stocktakings = data;
        });

        $scope.view = function (stocktaking) {
            $location.url('/stocktaking/' + stocktaking.id);
        };

        $scope.stocktaking = function () {
            var confirmed = $window.confirm('Oled kindel, et tahad teha inventuuri? Kasutajate saldod nullitakse ja tehingud eemaldatakse.');
            if (confirmed) {
                $http.post('/stocktaking/generate').success(function (data) {
                    $scope.stocktakings.push(data);
                });
            }
        };
    };

    global.StocktakingViewController = function($scope, $http, $location, $routeParams, $window){

        $http.get('/stocktaking/' + $routeParams.id).success(function (data) {
            $scope.stocktaking = data;
        });

        $http.get('/stocktaking/' + ($routeParams.id - 1)).success(function (data) {
            $scope.previous = data;
        });

        $scope.back = function () {
            $location.url('/stocktakings');
        };

        $scope.download = function (stocktaking) {
            $window.open('/stocktaking/csv/' + stocktaking.id);
        };

    };

    global.FeedbackController = function ($scope, $http) {
        $http.get('/feedback').success(function (data) {
            $scope.feedbacks = data;
        });

        $scope.deleteFeedback = function (feedback) {
            $http.delete('/feedback/' + feedback.id).success(function () {
                $scope.feedbacks = $scope.feedbacks.filter(function (u) {return feedback.id !== u.id; });
            });
        };
    };
}(this));
