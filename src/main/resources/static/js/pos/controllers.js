(function (angular) {
	"use strict";

	var app = angular.module('fratpos');

	app.controller('PosController', function ($scope, api, $timeout, $modal, notify) {

		var getData = function () {
			api.posdata().success(function (data) {
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
			return $scope.products.filter(function (product) {
				return product.quantity > 0;
			});
		};

		$scope.haveZeroQuantity = function () {
			if ($scope.products === undefined) {
				return false;
			}
			return $scope.products.some(function (product) {
				return product.quantity <= 0;
			});
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
				for (i = 0; i < paytype.allowedForStatus.length; i += 1) {
					status = paytype.allowedForStatus[i];
					if ($scope.user.status !== undefined && status.name === $scope.user.status.name) {
						return false;
					}
				}
			}
			return true;
		};

		var updateStatus = function (message, error) {
			if (error) {
				notify.error(message);
			} else {
				notify.success(message);
			}
		};

		var productsArray = function (products) {
			var arr = [], p;
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
				var transaction = new api.Transaction({
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
			var transactions = $scope.transactions || [];
			if ($scope.showAllTransactions || transactions.length <= 5) {
				return transactions;
			} else {
				return transactions.slice(0, 5);
			}
		};

		$scope.openFeedbackDialog = function () {

			var modalScope = $scope.$new();
			modalScope.feedback = new api.Feedback();

			var d = $modal({
				templateUrl: '/dialog/feedback',
				scope: modalScope
			});

			modalScope.save = function (feedback) {
				feedback.$save(function () {
					updateStatus('Tagasiside edastatud!', false);
					d.hide();
				}, function () {
					updateStatus('Tagasiside jätmine ebaõnnestus!', true);
				});
			};
		};

		$scope.openInfoDialog = function (user) {

			var modalScope = $scope.$new();
			modalScope.user = user;

			$modal({
				templateUrl: '/dialog/info',
				scope: modalScope
			});

			api.stat(user).success(function (stat) {
				modalScope.stat = stat;
				var colors = ['#4A89DC', '#37BC9B', '#3BAFDA', '#DA4453', '#8CC152', '#434A54', '#E9573F', '#D770AD', '#967ADC', '#F6BB42'];
				modalScope.colors = colors;

				var data = [], labels = [], i;

				for (i = 0; (i < 10) && (i < stat.popularProducts.length); i += 1) {
					var popularProduct = stat.popularProducts[i];
					labels.push(popularProduct.product.name);
					data.push(popularProduct.count);
				}

				modalScope.chartdata = {datasets: [{data: data, backgroundColor: colors}], labels: labels};
			});

		};

		$scope.openTransactionDialog = function (transaction) {

			var modalScope = $scope.$new();
			modalScope.transaction = transaction;

			var d = $modal({
				templateUrl: '/dialog/transaction',
				scope: modalScope
			});

			modalScope.invalidate = function (transaction) {
				api.invalidate(transaction).success(function () {
					getData();
					d.hide();
				});
			};
		};
	});

}(this.angular));
