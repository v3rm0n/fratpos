(function (angular) {
	"use strict";

	var app = angular.module('fratis');

	app.controller('UsersController', function ($scope, $uibModal, api, notify, $location) {

		api.Users.getList().then(function (users) {
			$scope.users = users;
			$scope.totalUsers = users.length;
		});

		$scope.currentPage = 1;
		$scope.sortfield = 'label';

		$scope.filteredUsers = function () {
			var users = $scope.users;
			if ($scope.filter !== undefined && $scope.filter.length > 0) {
				users = users.filter(function (user) {
					return user.label.toLowerCase().indexOf($scope.filter.toLowerCase()) !== -1;
				});
			}
			users = _.sortByOrder(users, [$scope.sortfield], [$scope.asc ? 'asc' : 'desc']);
			var currentPage = $scope.currentPage;
			$scope.totalUsers = users.length;
			return users.slice((currentPage - 1) * 10, currentPage * 10);
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
				return users.reduce(function (sum, user) {
					return sum + user.balance;
				}, 0);
			}
			return 0;
		};

		$scope.openProfile = function (user) {
			$location.url('/profile/' + user.id);
		};

		$scope.openUserDialog = function (user) {

			var d = $uibModal.open({
				templateUrl: '/dialog/user',
				controller: 'UserModalController',
				controllerAs: 'vm'
			});

			d.result.then(function () {
				api.Users.getList().then(function (users) {
					$scope.users = users;
				});
			});
		};
	});

	app.controller('UserModalController', function ($uibModalInstance, api, notify, $location) {

		var vm = this;

		vm.statuses = api.Statuses.getList().$object;

		vm.save = function (user) {
			api.Users.post(user).then(function (user) {
				$uibModalInstance.close();
				notify.success('Liige edukalt lisatud!');
				$location.url('/profile/' + user.id);
			}, function () {
				notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!');
			});
		};

	});

	app.controller('TransactionsController', function ($scope, api, $uibModal) {

		$scope.transactions = [];

		api.Transactions.getList().then(function (transactions) {
			$scope.transactions = transactions;
			$scope.totalTransactions = transactions.length;
			$scope.totalSum = transactions.reduce(function (sum, transaction) {
				if (!transaction.invalid) {
					return sum + transaction.sum;
				}
				return sum;
			}, 0);
		});

		$scope.currentPage = 1;

		$scope.filteredTransactions = function () {
			var transactions = $scope.transactions;
			var currentPage = $scope.currentPage;
			$scope.totalTransactions = transactions.length;
			return transactions.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.openDialog = function (transaction) {

			$uibModal.open({
				templateUrl: '/dialog/transaction',
				controller: 'TransactionsModalController',
				controllerAs: 'vm',
				resolve: {
					transaction: function () {
						return transaction;
					}
				}
			});
		};
	});

	app.controller('TransactionsModalController', function ($uibModalInstance, notify, transaction) {

		this.transaction = transaction;

		this.invalidate = function (transaction) {
			transaction.invalidate().then(function () {
				transaction.invalid = true;
				$uibModalInstance.close();
				notify.success('Tehing tagasi võetud!');
			}, function () {
				notify.error('Tehingut ei õnnestunud tagasi võtta!');
			});
		};
	});

	app.controller('ProductsController', function ($scope, api, $uibModal) {

		$scope.products = [];

		var init = function () {
			api.Products.getList().then(function (products) {
				$scope.products = products;
				$scope.totalProd = products.length;
				$scope.totalProducts = products.reduce(function (sum, product) {
					return sum + product.quantity;
				}, 0);
			});
		};

		init();

		$scope.currentPage = 1;
		$scope.sortfield = 'name';

		$scope.sortedProducts = function () {
			var products = _.sortByOrder($scope.products, [$scope.sortfield], [$scope.asc ? 'asc' : 'desc']);
			var currentPage = $scope.currentPage;
			$scope.totalProd = products.length;
			return products.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.asc = true;

		$scope.sort = function (sortfield) {
			if ($scope.sortfield === sortfield) {
				$scope.asc = !$scope.asc;
			}
			$scope.sortfield = sortfield;
		};

		$scope.rowColor = function (product) {
			return product.quantity <= 0 ? 'red' : '';
		};

		$scope.openProductDialog = function (product) {

			var d = $uibModal.open({
				templateUrl: '/dialog/product',
				controller: 'ProductsModalController',
				controllerAs: 'vm',
				resolve: {
					product: function () {
						return product ? product.clone() : api.Products.create();
					}
				}
			});

			d.result.then(init, function (reason) {
				if (reason !== undefined) {
					$scope.openProductDialog(product);
				}
			});

		};
	});

	app.controller('ProductsModalController', function ($uibModalInstance, product, notify, $q) {

		this.product = product;

		this.save = function (product) {
			product.save().then(function () {
				$uibModalInstance.close();
				notify.success('Muudatused salvestatud!');
			}, function () {
				notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!');
			});
		};

		this.delete = function (product) {
			var defer = $q.defer();
			$uibModalInstance.close(defer.promise);
			notify.warning({
				title: 'Oled kindel, et tahad toote kustutada?'
			}, function (isConfirmed) {
				if (isConfirmed) {
					product.remove().then(function () {
						defer.resolve();
						notify.success('Toode eemaldatud!');
					}, function () {
						defer.reject("Error");
						notify.error('Ei õnnestunud toodet kustutada!');
					});
				} else {
					defer.reject("Cancel");
				}
			});
		};
	});

	app.controller('PaytypesController', function ($scope, api, $uibModal) {

		$scope.paytypes = api.Paytypes.getList().$object;

		$scope.openPaytypeDialog = function (paytype) {
			api.Statuses.getList().then(function (statuses) {

				var d = $uibModal.open({
					templateUrl: '/dialog/paytype',
					controller: 'PaytypesModalController',
					controllerAs: 'vm',
					resolve: {
						statuses: function () {
							return statuses;
						},
						paytype: function () {
							return paytype.clone() || api.Paytypes.create();
						}
					}
				});

				d.result.then(function () {
					$scope.paytypes = api.Paytypes.getList().$object;
				}, function (reason) {
					if (reason !== undefined) {
						$scope.openPaytypeDialog(paytype);
					}
				});

			});
		};

		$scope.statuses = function (paytype) {
			return paytype.allowedForStatus.reduce(function (prev, curr) {
				return prev + curr.name + ", ";
			}, "").slice(0, -2);
		};
	});

	app.controller('PaytypesModalController', function ($uibModalInstance, api, notify, paytype, statuses, $q) {

		var vm = this;

		vm.statuses = statuses;
		vm.paytype = paytype;
		vm.checked = {};
		vm.allowedForStatus = {};

		if (paytype.allowedForStatus) {
			paytype.allowedForStatus.forEach(function (status) {
				vm.allowedForStatus[status.id] = true;
			});
		}

		vm.save = function (p) {
			if (p !== undefined) {
				p.allowedForStatus = _.chain(vm.allowedForStatus).map(function (selected, id) {
					if (selected) {
						return _.filter(statuses, {id: parseInt(id, 10)});
					}
					return [];
				}).flatten().value();
			}
			p.save().then(function () {
				$uibModalInstance.close();
				notify.success('Muudatused salvestatud!');
			}, function () {
				notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!');
			});
		};

		vm.delete = function (paytype) {
			var defer = $q.defer();
			$uibModalInstance.close(defer.promise);
			notify.warning({
				title: 'Oled kindel, et tahad makseviisi kustutada?'
			}, function (isConfirmed) {
				if (isConfirmed) {
					paytype.remove().then(function () {
						defer.resolve();
					}, function () {
						defer.reject('Error');
						notify.error('Ei õnnestunud makseviisi kustutada!');
					});
				} else {
					defer.reject('Cancel');
				}
			});
		};
	});

	app.controller('StatusesController', function ($scope, api, $uibModal) {

		$scope.statuses = api.Statuses.getList().$object;

		$scope.openStatusDialog = function (status) {

			var d = $uibModal.open({
				templateUrl: '/dialog/status',
				controller: 'StatusesModalController',
				controllerAs: 'vm',
				resolve: {
					status: function () {
						return status.clone() || api.Statuses.create();
					}
				}
			});

			d.result.then(function () {
				$scope.statuses = api.Statuses.getList().$object;
			}, function (reason) {
				if (reason) {
					$scope.openStatusDialog(status);
				}
			});

		};
	});

	app.controller('StatusesModalController', function ($uibModalInstance, notify, $q, status) {

		var vm = this;

		vm.status = status;

		vm.save = function (s) {
			s.save().then(function () {
				$uibModalInstance.close();
				notify.success('Muudatused salvestatud!');
			}, function () {
				notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!');
			});
		};

		vm.delete = function (status) {
			var defer = $q.defer();
			$uibModalInstance.close(defer.promise);
			notify.warning({
				title: 'Oled kindel, et tahad staatuse kustutada?'
			}, function (isConfirmed) {
				if (isConfirmed) {
					status.remove().then(function () {
						defer.resolve();
						notify.success('Staatus kustutatud!');
					}, function () {
						defer.reject('Error');
						notify.error('Ei õnnestunud staatust kustutada!');
					});
				} else {
					defer.reject('Cancel');
				}
			});
		};
	});

	app.controller('StocktakingController', function ($scope, api, $location, notify) {

		$scope.stocktakings = [];

		api.Stocktakings.getList().then(function (stocktakings) {
			$scope.stocktakings = stocktakings;
			$scope.totalStocktakings = stocktakings.length;
		});

		$scope.currentPage = 1;

		$scope.filteredStocktakings = function () {
			var stocktakings = $scope.stocktakings;
			var currentPage = $scope.currentPage;
			$scope.totalStocktakings = stocktakings.length;
			return stocktakings.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.view = function (stocktaking) {
			$location.url('/stocktaking/' + stocktaking.id);
		};

		$scope.stocktaking = function () {
			notify.warning({
				title: 'Inventuur',
				text: 'Oled kindel, et tahad teha inventuuri? Kasutajate saldod nullitakse ja tehingud eemaldatakse.',
				confirmButtonText: "Jah, tee inventuur!"
			}, function () {
				var stocktaking = api.Stocktakings.create();
				stocktaking.save().then(function (data) {
					$scope.stocktakings.push(data);
					notify.success('Inventuur tehtud');
				});
			});
		};
	});

	app.controller('StocktakingViewController', function ($scope, api, $location, $routeParams, $window) {

		$scope.stocktaking = api.Stocktakings.get($routeParams.id).$object;

		api.Stocktakings.get($routeParams.id - 1).then(function (previous) {
			$scope.previous = previous;
		});

		$scope.back = function () {
			$location.url('/stocktakings');
		};

		$scope.download = function (stocktaking) {
			$window.open('/stocktaking/csv/' + stocktaking.id);
		};

	});

	app.controller('FeedbackController', function ($scope, api, notify) {

		$scope.feedbacks = [];

		api.Feedbacks.getList().then(function (feedbacks) {
			$scope.feedbacks = feedbacks;
			$scope.totalFeedbacks = feedbacks.length;
		});

		$scope.currentPage = 1;

		$scope.filteredFeedbacks = function () {
			var feedbacks = $scope.feedbacks;
			var currentPage = $scope.currentPage;
			$scope.totalFeedbacks = feedbacks.length;
			return feedbacks.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.deleteFeedback = function (feedback) {
			feedback.remove().then(function () {
				$scope.feedbacks = $scope.feedbacks.filter(function (u) {
					return feedback.id !== u.id;
				});
				notify.success('Tagasiside kustutatud!');
			});
		};
	});

	app.controller('MenuController', function ($scope, $location) {

		$scope.isActive = function (menu) {
			var path = _.trimLeft($location.path(), '/');
			if (_.isArray(menu)) {
				return _.contains(menu, path);
			}
			return path === menu;
		};

	});

	app.controller('ProfileController', function ($scope, api, $routeParams, $q) {

		$scope.availableRoles = [];

		var initUser = function () {
			if ($routeParams.id) {
				$scope.userPromise = api.Users.get($routeParams.id);
			} else {
				$scope.userPromise = api.Me.get();
			}
			$scope.userPromise.then(function (user) {
				$scope.user = user;
			});
		};

		initUser();

		$scope.$on('user:changed', initUser);

		var rolesPromise = api.Roles.getList();

		rolesPromise.then(function (roles) {
			$scope.roles = roles;
		});

		var initAvailableRoles = function () {
			$q.all([rolesPromise, $scope.userPromise]).then(function (values) {
				var contains = function (role) {
					return _.find(values[1].roles, {id: role.id}) === undefined;
				};
				$scope.availableRoles = _.filter(values[0], contains);
			});
		};

		initAvailableRoles();

		$scope.$watch('user', initAvailableRoles);

		$scope.addRole = function (user, role) {
			if (!role) {
				return;
			}
			user.addRole(role).then(initUser);
		};

		$scope.removeRole = function (user, role) {
			user.removeRole(role).then(initUser);
		};

	});

	app.controller('SettingsController', function ($scope, $rootScope, api, notify, moment, $location) {

		$scope.statuses = api.Statuses.getList().$object;

		var initUser = function (user) {
			$scope.user = user;
			if (user.userProfile) {
				$scope.maskedBirthDate = moment(user.userProfile.formattedBirthdate, 'HH:mm DD.MM.YYYY').format('DD/MM/YYYY');
				$scope.userProfile = angular.copy(user.userProfile);
			}
		};

		$scope.$parent.userPromise.then(initUser);

		$scope.save = function (user, userProfile, maskedBirthDate) {
			user.save().then(function (user) {
				var birthdate = moment(maskedBirthDate, 'DD/MM/YYYY');
				if (birthdate.isValid()) {
					userProfile.birthdate = birthdate;
				}
				if (userProfile.id) {
					user.updateProfile(userProfile).then(function () {
						$rootScope.$broadcast('user:changed');
						notify.success('Liikme ' + user.label + ' andmed muudetud!');
					}, function () {
						notify.error('Liikme ' + user.label + ' andmete muutmine ebaõnnestus!');
					});
				} else {
					user.addProfile(userProfile).then(function (userProfile) {
						$scope.userProfile = userProfile;
						$rootScope.$broadcast('user:changed');
						notify.success('Liikme ' + user.label + ' andmed muudetud!');
					}, function () {
						notify.error('Liikme ' + user.label + ' andmete muutmine ebaõnnestus!');
					});
				}

			}, function () {
				notify.error('Liikme ' + user.label + ' andmete muutmine ebaõnnestus!');
			});
		};

		$scope.delete = function (user) {
			notify.warning({
				title: 'Liikme kustutamine',
				text: 'Oled kindel, et tahad liikme kustutada? Seda tegevust, ei ole võimalik tagasi keerata.',
				confirmButtonText: "Jah, kustuta!"
			}, function () {
				user.remove().then(function () {
					notify.success('Liige ' + user.label + ' kustutatud!');
					$location.url('/users');
				});
			});
		};
	});

	app.controller('RoleController', function ($scope, api, notify) {

		$scope.roles = [];

		api.Permissions.getList().then(function (permissions) {
			$scope.permissions = permissions;
		});

		$scope.changedPermissions = {};

		var initRoles = function () {
			api.Roles.getList().then(function (roles) {
				$scope.roles = roles;
				$scope.rolePermissions = {};
				roles.forEach(function (role) {
					role.permissions.forEach(function (permission) {
						$scope.rolePermissions[permission.id] = $scope.rolePermissions[permission.id] || {};
						$scope.rolePermissions[permission.id][role.id] = true;
					});
				});
			});
		};

		initRoles();

		$scope.addRole = function (newRole) {
			var role = api.Roles.create();
			role.name = newRole;
			role.save().then(function () {
				$scope.newRole = null;
				notify.success('Roll ' + newRole + ' lisatud!');
				initRoles();
			}, function () {
				notify.error('Rolli ei õnnestunud lisada, kontrolli andmeid!');
			});
		};

		var addPermissionToRole = function (role, permissionId) {
			role.addPermission(permissionId);
		};
		var removePermissionFromRole = function (role, permissionId) {
			role.removePermission(permissionId);
		};

		$scope.save = function () {
			angular.forEach($scope.changedPermissions, function (roles, permissionId) {
				angular.forEach(roles, function (obj) {
					if (obj.checked) {
						addPermissionToRole(obj.role, permissionId);
					} else {
						removePermissionFromRole(obj.role, permissionId);
					}
				});
			});
			notify.success('Rollid muudetud');
		};

		$scope.change = function (permission, role, checked) {
			$scope.changedPermissions[permission.id] = $scope.changedPermissions[permission.id] || {};
			$scope.changedPermissions[permission.id][role.id] = {checked: checked, role: role};
		};

	});

	app.controller('IncomeController', function ($scope, api, $uibModal) {

		$scope.incomes = [];

		var init = function () {
			api.Incomes.getList().then(function (incomes) {
				$scope.incomes = incomes;
				$scope.totalIncomes = incomes.length;
				$scope.totalIncome = incomes.reduce(function (sum, income) {
					return sum + income.amount;
				}, 0);
			});
		};

		init();

		$scope.currentPage = 1;

		$scope.filteredIncomes = function () {
			var incomes = $scope.incomes;
			var currentPage = $scope.currentPage;
			$scope.totalIncomes = incomes.length;
			return incomes.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.addNew = function () {
			var modal = $uibModal.open({
				templateUrl: '/dialog/income',
				controller: 'IncomeModalController',
				controllerAs: 'vm'
			});

			modal.result.then(init);
		};

	});

	app.controller('IncomeModalController', function ($uibModalInstance, api, notify, moment) {

		var vm = this;

		vm.users = api.Users.getList().$object;

		vm.incomeTypes = api.IncomeTypes.getList().$object;

		vm.changeType = function (income) {
			income.newType = undefined;
		};

		vm.changeNewType = function (income) {
			income.type = undefined;
		};

		vm.save = function (income) {
			var createIncome = function (incomeType) {
				var i = api.Incomes.create();
				i.incomeType = incomeType;
				i.user = income.user;
				i.amount = income.amount;
				i.date = moment(income.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
				i.save().then(function () {
					notify.success('Laekumine lisatud');
					$uibModalInstance.close();
				}, function () {
					notify.error('Laekumist ei õnnestunud lisada, kontrolli andmeid!');
				});
			};

			if (income.newType) {
				var incomeType = api.IncomeTypes.create();
				incomeType.name = income.newType;
				incomeType.save().then(createIncome);
			} else {
				createIncome(income.type);
			}
		};
	});

	app.controller('ObligationsController', function ($scope, api, $uibModal) {

		$scope.obligations = [];

		var init = function () {
			api.Obligations.getList().then(function (obligations) {
				$scope.obligations = obligations;
				$scope.totalObligations = obligations.length;
				$scope.totalObligation = obligations.reduce(function (sum, obligation) {
					return sum + obligation.amount;
				}, 0);
			});
		};

		init();

		$scope.currentPage = 1;

		$scope.filteredObligations = function () {
			var obligations = $scope.obligations;
			var currentPage = $scope.currentPage;
			$scope.totalObligations = obligations.length;
			return obligations.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.obligationInfo = function (obligation) {
			var modal = $uibModal.open({
				templateUrl: '/dialog/obligationInfo',
				controller: 'ObligationInfoController',
				controllerAs: 'vm',
				resolve: {
					obligation: function () {
						return obligation;
					}
				}
			});

			modal.result.then(init, function (reason) {
				if (reason) {
					$scope.obligationInfo(obligation);
				}
			});
		};

		$scope.addNew = function () {
			var modal = $uibModal.open({
				templateUrl: '/dialog/obligation',
				controller: 'ObligationModalController',
				controllerAs: 'vm'
			});

			modal.result.then(init);
		};
	});

	app.controller('ObligationModalController', function ($uibModalInstance, api, notify, moment, $q) {

		var vm = this;

		vm.users = api.Users.getList().$object;

		vm.obligationTypes = api.ObligationTypes.getList().$object;

		vm.recurring = false;

		vm.changeType = function (vm) {
			vm.newType = undefined;
		};

		vm.changeNewType = function (vm) {
			vm.type = undefined;
		};

		vm.changeAmount = function (vm) {
			vm.amountPerUser = undefined;
		};

		vm.changeAmountPerUser = function (vm) {
			vm.amount = undefined;
		};

		var amountPerUser = function (vm) {
			if (vm.amountPerUser) {
				return vm.amountPerUser;
			} else {
				return vm.amount / vm.user.length;
			}
		};

		var totalAmount = function (vm) {
			if (vm.amountPerUser) {
				return vm.amountPerUser * vm.user.length;
			} else {
				return vm.amount;
			}
		};

		var createUserObligation = function (obligation, vm) {
			return function (user) {
				var userObligation = {};
				userObligation.amount = amountPerUser(vm);
				userObligation.obligation = obligation;
				userObligation.user = user;
				return user.addObligation(userObligation);
			};
		};

		vm.save = function (vm) {
			var createObligation = function (obligationType) {
				var o = api.Obligations.create();
				o.obligationType = obligationType;
				o.description = vm.description;
				o.recurring = vm.recurring;
				o.amount = totalAmount(vm);
				if (vm.recurring) {
					o.startDate = vm.periodStart.format('YYYY-MM-DD');
					o.endDate = vm.periodEnd.format('YYYY-MM-DD');
				} else {
					var date = moment(vm.date, 'DD/MM/YYYY');
					if (date.isValid()) {
						o.startDate = date.format('YYYY-MM-DD');
					}
				}
				o.save().then(function (obligation) {
					$q.all(vm.user.map(createUserObligation(obligation, vm))).then(function () {
						notify.success('Laekumine lisatud');
						$uibModalInstance.close();
					}, function () {
						notify.error('Laekumist ei õnnestunud lisada, kontrolli andmeid!');

					});
				}, function () {
					notify.error('Laekumist ei õnnestunud lisada, kontrolli andmeid!');
				});
			};

			if (vm.newType) {
				var obligationType = api.ObligationTypes.create();
				obligationType.name = vm.newType;
				obligationType.save().then(createObligation);
			} else {
				createObligation(vm.type);
			}
		};
	});

	app.controller('ObligationInfoController', function ($uibModalInstance, obligation, notify, $q) {
		var vm = this;

		vm.obligation = obligation;

		obligation.all('userobligations').getList().then(function (userObligations) {
			vm.userObligations = userObligations;
		});

		vm.delete = function (obligation) {
			var defer = $q.defer();
			$uibModalInstance.close(defer.promise);
			notify.warning({
				title: 'Kohustuse kustutamine',
				text: 'Oled kindel, et tahad kohustuse kustutada? Seda tegevust, ei ole võimalik tagasi keerata.',
				confirmButtonText: "Jah, kustuta!"
			}, function (isConfirmed) {
				if (isConfirmed) {
					obligation.remove().then(function () {
						defer.resolve();
						notify.success('Kohustus kustutatud!');
					}, function () {
						defer.reject('Error');
						notify.error('Ei õnnestunud kohustust kustutada!');
					});
				} else {
					defer.reject('Cancel');
				}
			});
		};
	});

	app.controller('UserObligationsController', function ($scope) {

		$scope.recurringObligations = [];
		$scope.obligations = [];

		$scope.$parent.userPromise.then(function (user) {
			user.all('obligations').getList().then(function (obligations) {
				$scope.recurringObligations = _.filter(obligations, {obligation: {recurring: true}});
				$scope.obligations = _.filter(obligations, {obligation: {recurring: false}});
			});
		});

	});
	app.controller('UserIncomesController', function ($scope) {

		$scope.incomes = [];

		$scope.$parent.userPromise.then(function (user) {
			user.all('incomes').getList().then(function (incomes) {
				$scope.incomes = incomes;
			});
		});
	});

}(window.angular));
