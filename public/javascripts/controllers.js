/*jslint es5: true nomen: true forin: true vars: true*/
(function (global) {
    "use strict";

    global.PosController = function ($scope, api, $timeout) {

        api.init();

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

        $scope.intro = function () {
            var opts = {
                nextLabel: "Järgmine",
                prevLabel: "Eelmine",
                skipLabel: "Lõpeta"
            };
            global.introJs().setOptions(opts).start();
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

        $scope.changeQuantity = function (product, quantity) {
            var selectedProduct = $scope.selectedProducts[product._id];
            if (selectedProduct === undefined) {
                selectedProduct = global.angular.copy(product);
                selectedProduct.quantity = 0;
                $scope.selectedProducts[product._id] = selectedProduct;
            }
            var newQuantity = selectedProduct.quantity + quantity;
            if (newQuantity >= 0) {
                selectedProduct.quantity = newQuantity;
            }
        };

        $scope.quantity = function (product) {
            var qty = 0;
            var selectedProduct = $scope.selectedProducts[product._id];
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
                return paytype.allowedForStatus.indexOf($scope.user.status) === -1;
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
                var data = {products: $scope.selectedProducts, type: paytype.name, user: $scope.user};
                api.transaction(data, function (data) {
                    if (data.status === 'success') {
                        updateStatus('Tooted läksid edukalt kirja!', false);
                        var id,
                            decrementQuantity = function (selectedProduct, id) {
                                return function (product) {
                                    if (product._id === id) {
                                        product.quantity -= selectedProduct.quantity;
                                    }
                                };
                            };
                        for (id in $scope.selectedProducts) {
                            var selectedProduct = $scope.selectedProducts[id];
                            $scope.products.forEach(decrementQuantity(selectedProduct, id));
                        }
                        $scope.selectedProducts = {};
                        $scope.user = undefined;
                        $scope.transactions.unshift(data.transaction);
                    } else {
                        updateStatus('Viga tehingul: ' + data.status, true);
                    }
                });
            } else {
                updateStatus('Palun vali toode ja kasutaja enne maksmist', true);
            }
        };

        $scope.invalidTransaction = function (transaction) {
            var confirmed = global.confirm('Kas oled kindel, et tahad selle tehingu tagasi võtta?');
            if (confirmed) {
                api.invalid(transaction, function (data) {
                    var handleSuccess = function () {
                        updateStatus('Tehing tagasi võetud!', false);
                        $scope.transactions = $scope.transactions.filter(function (item) {return item._id !== transaction._id; });
                    };
                    var handlePassword = function (data) {
                        if (data.status && data.status !== "success") {
                            var password = global.prompt('Tehingu tegemise ajast on möödunud liiga kaua. Palun sisesta admin parool, kui tahad tehingut ikkagi katkestada');
                            if (password !== undefined) {
                                api.invalid(transaction, password, function (data) {
                                    handlePassword(data);
                                });
                            }
                        } else {
                            handleSuccess();
                        }
                    };
                    handlePassword(data);
                });
            }
        };
    };

    global.NavController = function ($scope, $location) {
        $scope.isActive = function (page) {
            return $location.path() === '/' + page;
        };
    };

    global.DialogController = function ($scope, $http, dialog, object) {

        $scope.object = object || {};

        $http.get('/statuses').success(function (data) {
            $scope.statuses = data;
            if ($scope.object.status === '' && $scope.statuses.length > 0) {
                $scope.object.status = $scope.statuses[0].name;
            }
        });

        $scope.updateForStatus = function (status) {
            var allowed = $scope.object.allowedForStatus || [];
            if (allowed.indexOf(status.name) === -1 && status.checked) {
                allowed.push(status.name);
            } else if (!status.checked) {
                allowed.splice(allowed.indexOf(status.name), 1);
            }
            $scope.object.allowedForStatus = allowed;
        };

        $scope.close = function () {
            dialog.close();
        };

        $scope.save = function (object) {
            dialog.close(object);
        };
    };

    global.UsersController = function ($scope, $http, $dialog) {

        $http.get('/users').success(function (data) {
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

        $scope.deleteUser = function (user) {
            $http.post('/users/remove', {id: user._id}).success(function () {
                $scope.users = $scope.users.filter(function (u) {return user._id !== u._id; });
            });
        };

        $scope.openBalanceDialog = function (user) {
            var d = $dialog.dialog({resolve: {object: function () { return user; }}});
            d.open('/dialog/balance', global.DialogController).then(function (result) {
                if (result) {
                    $http.post('/users/save', {user: result});
                }
            });
        };

        $scope.openUserDialog = function (user) {
            var userMissing = user === undefined;
            if (userMissing) {
                user = {};
                user.status = '';
            }
            var d = $dialog.dialog({resolve: {object: function () {return user; }}});
            d.open('/dialog/user', global.DialogController).then(function (result) {
                if (result) {
                    $http.post('/users/save', {user: result}).success(function (data) {
                        if (userMissing) {
                            $scope.users.push(data);
                        }
                    });
                }
            });
        };
    };

    global.TransactionsController = function ($scope, $http, $dialog) {
        $http.get('/transactions').success(function (data) {
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
            var d = $dialog.dialog({resolve: {object: function () { return transaction; }}});
            d.open('/dialog/transaction', global.DialogController).then(function (result) {
                if (result) {
                    $http.post('/transaction/invalid/admin', {id: result._id}).success(function (data) {
                        result.invalid = true;
                    });
                }
            });
        };
    };

    global.ProductsController = function ($scope, $http, $dialog) {
        $http.get('/products').success(function (data) {
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

        $scope.deleteProduct = function (product) {
            $http.post('/products/remove', {id: product._id}).success(function () {
                $scope.products = $scope.products.filter(function (u) {return product._id !== u._id; });
            });
        };

        $scope.openProductDialog = function (product) {
            var d = $dialog.dialog({resolve: {object: function () {return product; }}});
            d.open('/dialog/product', global.DialogController).then(function (result) {
                if (result) {
                    $http.post('/products/save', {product: result}).success(function (data) {
                        if (product === undefined) {
                            $scope.products.push(data);
                        }
                    });
                }
            });
        };
    };

    global.PaytypesController = function ($scope, $http, $dialog) {
        $http.get('/paytypes').success(function (data) {
            $scope.paytypes = data;
        });

        $scope.deletePaytype = function (paytype) {
            $http.post('/paytypes/remove', {id: paytype._id}).success(function () {
                $scope.paytypes = $scope.paytypes.filter(function (u) {return paytype._id !== u._id; });
            });
        };

        $scope.openPaytypeDialog = function (paytype) {
            var d = $dialog.dialog({resolve: {object: function () {return paytype; }}});
            d.open('/dialog/paytype', global.DialogController).then(function (result) {
                if (result) {
                    $http.post('/paytypes/save', {paytype: result}).success(function (data) {
                        if (paytype === undefined) {
                            $scope.paytypes.push(data);
                        }
                    });
                }
            });
        };
    };

    global.StatusesController = function ($scope, $http, $dialog) {
        $http.get('/statuses').success(function (data) {
            $scope.statuses = data;
        });

        $scope.deleteStatus = function (status) {
            $http.post('/statuses/remove', {id: status._id}).success(function () {
                $scope.statuses = $scope.statuses.filter(function (u) {return status._id !== u._id; });
            });
        };

        $scope.openStatusDialog = function (status) {
            var d = $dialog.dialog({resolve: {object: function () {return status; }}});
            d.open('/dialog/status', global.DialogController).then(function (result) {
                if (result) {
                    $http.post('/statuses/save', {status: result}).success(function (data) {
                        if (status === undefined) {
                            $scope.statuses.push(data);
                        }
                    });
                }
            });
        };
    };

    global.StocktakingController = function ($scope, $http, $window) {
        $http.get('/stocktakings').success(function (data) {
            $scope.stocktakings = data;
        });

        $scope.download = function (stocktaking) {
            $window.open('/stocktakings/csv/' + stocktaking._id);
        };

        $scope.view = function (stocktaking) {
            $window.open('/stocktakings/html/' + stocktaking._id);
        };

        $scope.stocktaking = function () {
            var confirmed = global.confirm('Oled kindel, et tahad teha inventuuri? Kasutajate saldod nullitakse ja tehingud eemaldatakse.');
            if (confirmed) {
                $http.post('/stocktakings/generate').success(function (data) {
                    $scope.stocktakings.push(data);
                });
            }
        };
    };
}(this));