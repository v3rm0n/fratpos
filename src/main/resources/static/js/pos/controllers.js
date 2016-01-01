(function (angular, _) {
	"use strict";

	var app = angular.module('fratpos');

	app.controller('PosController', function ($scope, api, $timeout, $uibModal, notify) {

		var getData = function () {
			$scope.users = api.Users.getList().$object;
			$scope.transactions = api.Transactions.getList().$object;
			$scope.products = api.Products.getList().$object;
			$scope.paytypes = api.Paytypes.getList().$object;
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
			var chain = _.chain($scope.products).sortBy('name');
			if ($scope.showAllProducts || !$scope.products) {
				return chain.value();
			}
			return chain.filter(function (product) {
				return product.quantity > 0;
			}).value();
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
			return _.reduce($scope.selectedProducts, function (sum, product) {
				return sum + product.price * product.quantity;

			}, 0);
		};

		$scope.isDisabled = function (paytype) {
			if ($scope.user && $scope.user.status) {
				return !_.any(paytype.allowedForStatus, {name: $scope.user.status.name});
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
			return _.map(products, function (product) {
				var transactionProduct = angular.copy(product);
				transactionProduct.product = product;
				transactionProduct.id = null;
				return transactionProduct;
			});
		};

		$scope.pay = function (paytype) {
			if (!_.isEmpty($scope.selectedProducts) && $scope.user) {
				api.Transactions.post({
					products: productsArray($scope.selectedProducts),
					paytype: paytype,
					user: $scope.user
				}).then(function () {
					updateStatus('Tooted läksid edukalt kirja!', false);
					$scope.user = undefined;
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
			var chain = _.chain($scope.transactions).filter({invalid: false}).sortByOrder(['created'], ['desc']);
			if ($scope.showAllTransactions || chain.size() <= 5) {
				return chain.value();
			} else {
				return chain.take(5).value();
			}
		};

		$scope.openFeedbackDialog = function () {

			var d = $uibModal.open({
				templateUrl: '/dialog/feedback',
				controller: 'FeedbackModalController',
				controllerAs: 'vm'
			});

			d.result.then(function () {
				updateStatus('Tagasiside edastatud!', false);
			}, function (reason) {
				if (reason) {
					updateStatus('Tagasiside jätmine ebaõnnestus!', true);
				}
			});
		};

		$scope.openInfoDialog = function (user) {
			$uibModal.open({
				templateUrl: '/dialog/info',
				controller: 'InfoModalController',
				controllerAs: 'vm',
				resolve: {
					user: function () {
						return user;
					}
				}
			});
		};

		$scope.openTransactionDialog = function (transaction) {

			var d = $uibModal.open({
				templateUrl: '/dialog/transaction',
				controller: 'TransactionModalController',
				controllerAs: 'vm',
				resolve: {
					transaction: function () {
						return transaction;
					}
				}
			});

			d.result.then(function () {
				updateStatus('Tehing tagasi võetud!', false);
				getData();
			});
		};
	});

	app.controller('FeedbackModalController', function ($uibModalInstance, api) {
		var vm = this;

		vm.save = function (feedback) {
			api.Feedbacks.post(feedback).then(function () {
				$uibModalInstance.close();
			}, function () {
				$uibModalInstance.dismiss('Error');
			});
		};
	});

	app.controller('InfoModalController', function ($uibModalInstance, api, user) {
		var vm = this;

		vm.user = user;

		api.stat(user).success(function (stat) {
			vm.stat = stat;
			var colors = ['#4A89DC', '#37BC9B', '#3BAFDA', '#DA4453', '#8CC152', '#434A54', '#E9573F', '#D770AD', '#967ADC', '#F6BB42'];
			vm.colors = colors;

			var data = [], labels = [], i;

			for (i = 0; (i < 10) && (i < stat.popularProducts.length); i += 1) {
				var popularProduct = stat.popularProducts[i];
				labels.push(popularProduct.product.name);
				data.push(popularProduct.count);
			}

			vm.chartdata = {datasets: [{data: data, backgroundColor: colors}], labels: labels};
		});
	});

	app.controller('TransactionModalController', function ($uibModalInstance, transaction) {
		var vm = this;

		vm.transaction = transaction;

		vm.invalidate = function (transaction) {
			transaction.invalidate().then($uibModalInstance.close);
		};
	});

}(window.angular, window._));
