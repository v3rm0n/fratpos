(function (angular) {
	"use strict";

	var app = angular.module('fratis');

	app.controller('UsersController', function ($scope, $uibModal, api, notify, $location) {

		$scope.users = api.User.query();

		$scope.currentPage = 1;
		$scope.sortfield = 'label';

		$scope.users.$promise.then(function () {
			$scope.totalUsers = $scope.users.length;
		});

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
				$scope.users = api.User.query();
			});
		};
	});

	app.controller('UserModalController', function ($uibModalInstance, api, notify, $location) {

		var vm = this;

		vm.user = new api.User();

		vm.statuses = api.Status.query();

		vm.save = function (user) {
			user.$save(function (user) {
				$uibModalInstance.close();
				notify.success('Liige edukalt lisatud!');
				$location.url('/profile/' + user.id);
			}, function () {
				notify.error('Salvestamine ebaõnnestus, kontrolli andmeid!');
			});
		};

	});

	app.controller('TransactionsController', function ($scope, api, $uibModal) {

		$scope.transactions = api.Transaction.query();

		$scope.currentPage = 1;

		$scope.filteredTransactions = function () {
			var transactions = $scope.transactions;
			var currentPage = $scope.currentPage;
			$scope.totalTransactions = transactions.length;
			return transactions.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.transactions.$promise.then(function (transactions) {
			$scope.totalTransactions = transactions.length;
			$scope.totalSum = transactions.reduce(function (sum, transaction) {
				if (!transaction.invalid) {
					return sum + transaction.sum;
				}
				return sum;
			}, 0);
		});

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
			transaction.$invalidate(function () {
				transaction.invalid = true;
				$uibModalInstance.close();
				notify.success('Tehing tagasi võetud!');
			}, function () {
				notify.error('Tehingut ei õnnestunud tagasi võtta!');
			});
		};
	});

	app.controller('ProductsController', function ($scope, api, $uibModal) {

		$scope.products = api.Product.query();

		$scope.currentPage = 1;
		$scope.sortfield = 'name';

		$scope.products.$promise.then(function () {
			$scope.totalProd = $scope.products.length;
			$scope.totalProducts = $scope.products.reduce(function (sum, product) {
				return sum + product.quantity;
			}, 0);
		});

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
						return angular.copy(product) || new api.Product();
					}
				}
			});

			d.result.then(function () {
				$scope.products = api.Product.query();
			}, function (reason) {
				if (reason !== undefined) {
					$scope.openProductDialog(product);
				}
			});

		};
	});

	app.controller('ProductsModalController', function ($uibModalInstance, product, notify, $q) {

		this.product = product;

		this.save = function (product) {
			product.$save(function () {
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
					product.$remove(function () {
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

		$scope.paytypes = api.Paytype.query();

		$scope.openPaytypeDialog = function (paytype) {
			api.Status.query(function (statuses) {

				var d = $uibModal.open({
					templateUrl: '/dialog/paytype',
					controller: 'PaytypesModalController',
					controllerAs: 'vm',
					resolve: {
						statuses: function () {
							return statuses;
						},
						paytype: function () {
							return angular.copy(paytype) || new api.Paytype();
						}
					}
				});

				d.result.then(function () {
					$scope.paytypes = api.Paytype.query();
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
			p.$save(function () {
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
					paytype.$remove(function () {
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

		$scope.statuses = api.Status.query();

		$scope.openStatusDialog = function (status) {

			var d = $uibModal.open({
				templateUrl: '/dialog/status',
				controller: 'StatusesModalController',
				controllerAs: 'vm',
				resolve: {
					status: function () {
						return angular.copy(status) || new api.Status();
					}
				}
			});

			d.result.then(function () {
				$scope.statuses = api.Status.query();
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
			s.$save(function () {
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
					status.$remove(function () {
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

		$scope.stocktakings = api.Stocktaking.query();

		$scope.currentPage = 1;

		$scope.stocktakings.$promise.then(function () {
			$scope.totalStocktakings = $scope.stocktakings.length;
		});

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
				var stocktaking = new api.Stocktaking();
				stocktaking.$save(function (data) {
					$scope.stocktakings.push(data);
					notify.success('Inventuur tehtud');
				});
			});
		};
	});

	app.controller('StocktakingViewController', function ($scope, api, $location, $routeParams, $window) {

		$scope.stocktaking = api.Stocktaking.get({id: $routeParams.id});

		api.Stocktaking.get({id: $routeParams.id - 1}, function (previous) {
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

		$scope.feedbacks = api.Feedback.query();

		$scope.currentPage = 1;

		$scope.feedbacks.$promise.then(function () {
			$scope.totalFeedbacks = $scope.feedbacks.length;
		});

		$scope.filteredFeedbacks = function () {
			var feedbacks = $scope.feedbacks;
			var currentPage = $scope.currentPage;
			$scope.totalFeedbacks = feedbacks.length;
			return feedbacks.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.deleteFeedback = function (feedback) {
			feedback.$remove(function () {
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
				$scope.user = api.User.get({id: $routeParams.id});
			} else {
				$scope.user = api.User.me();
			}
		};

		initUser();

		$scope.$on('user:changed', initUser);

		$scope.roles = api.Role.query();

		var initAvailableRoles = function () {
			$q.all([$scope.roles.$promise, $scope.user.$promise]).then(function (values) {
				var contains = function (role) {
					return _.find(values[1].roles, {id: role.id}) === undefined;
				};
				$scope.availableRoles = _.filter(values[0], contains);
			});
		};

		initAvailableRoles();

		$scope.$watch('user', initAvailableRoles);

		$scope.addRole = function (role) {
			if (!role) {
				return;
			}
			api.User.addRole({id: $scope.user.id, roleId: role.id}, initUser);
		};

		$scope.removeRole = function (role) {
			api.User.removeRole({id: $scope.user.id, roleId: role.id}, initUser);
		};

	});

	app.controller('SettingsController', function ($scope, $rootScope, api, $routeParams, notify, moment, $location) {
		$scope.statuses = api.Status.query();

		if ($routeParams.id) {
			$scope.user = api.User.get({id: $routeParams.id});
		} else {
			$scope.user = api.User.me();
		}

		$scope.user.$promise.then(function (user) {
			if (user.userProfile) {
				$scope.maskedBirthDate = moment(user.userProfile.formattedBirthdate, 'HH:mm DD.MM.YYYY').format('DD/MM/YYYY');
				$scope.userProfile = angular.copy(user.userProfile);
			}
		});

		$scope.save = function (user, userProfile, maskedBirthDate) {
			user.$save(function () {
				var birthdate = moment(maskedBirthDate, 'DD/MM/YYYY');
				if (birthdate.isValid()) {
					userProfile.birthdate = birthdate;
				}
				if (userProfile.id) {
					api.User.updateProfile({id: user.id, userProfileId: userProfile.id}, userProfile, function () {
						$rootScope.$broadcast('user:changed');
						notify.success('Liikme ' + user.label + ' andmed muudetud!');
					}, function () {
						notify.error('Liikme ' + user.label + ' andmete muutmine ebaõnnestus!');
					});
				} else {
					api.User.addProfile({id: user.id}, userProfile, function (userProfile) {
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
				user.$delete(function () {
					notify.success('Liige ' + user.label + ' kustutatud!');
					$location.url('/users');
				});
			});
		};
	});

	app.controller('RoleController', function ($scope, api, notify) {

		$scope.permissions = api.Permission.query();
		$scope.changedPermissions = {};

		var initRoles = function () {
			$scope.roles = api.Role.query(function (roles) {
				$scope.rolePermissions = {};
				roles.forEach(function (role) {
					$scope.permissions.$promise.then(function () {
						role.permissions.forEach(function (permission) {
							$scope.rolePermissions[permission.id] = $scope.rolePermissions[permission.id] || {};
							$scope.rolePermissions[permission.id][role.id] = true;
						});
					});
				});
			});
		};

		initRoles();

		$scope.addRole = function (newRole) {
			var role = new api.Role();
			role.name = newRole;
			role.$save(function () {
				$scope.newRole = null;
				notify.success('Roll ' + newRole + ' lisatud!');
				initRoles();
			}, function () {
				notify.error('Rolli ei õnnestunud lisada, kontrolli andmeid!');
			});
		};

		var addPermissionToRole = function (roleId, permissionId) {
			api.Role.addPermission({id: roleId, permissionId: permissionId});
		};
		var removePermissionFromRole = function (roleId, permissionId) {
			api.Role.removePermission({id: roleId, permissionId: permissionId});
		};

		$scope.save = function () {
			angular.forEach($scope.changedPermissions, function (roles, permissionId) {
				angular.forEach(roles, function (checked, roleId) {
					if (checked) {
						addPermissionToRole(roleId, permissionId);
					} else {
						removePermissionFromRole(roleId, permissionId);
					}
				});
			});
			notify.success('Rollid muudetud');
		};

		$scope.change = function (permission, role, checked) {
			$scope.changedPermissions[permission.id] = $scope.changedPermissions[permission.id] || {};
			$scope.changedPermissions[permission.id][role.id] = checked;
		};

	});

	app.controller('IncomeController', function ($scope, api, $uibModal) {

		var init = function () {
			$scope.incomes = api.Income.query();
		};

		init();

		$scope.currentPage = 1;

		$scope.filteredIncomes = function () {
			var incomes = $scope.incomes;
			var currentPage = $scope.currentPage;
			$scope.totalIncomes = incomes.length;
			return incomes.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.incomes.$promise.then(function (incomes) {
			$scope.totalIncomes = incomes.length;
			$scope.totalIncome = incomes.reduce(function (sum, income) {
				return sum + income.amount;
			}, 0);
		});

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

		vm.users = api.User.query();

		vm.incomeTypes = api.IncomeType.query();

		vm.changeType = function (income) {
			income.newType = undefined;
		};

		vm.changeNewType = function (income) {
			income.type = undefined;
		};

		vm.save = function (income) {
			var createIncome = function (incomeType) {
				var i = new api.Income();
				i.incomeType = incomeType;
				i.user = income.user;
				i.amount = income.amount;
				i.date = moment(income.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
				i.$save(function () {
					notify.success('Laekumine lisatud');
					$uibModalInstance.close();
				}, function () {
					notify.error('Laekumist ei õnnestunud lisada, kontrolli andmeid!');
				});
			};

			if (income.newType) {
				var incomeType = new api.IncomeType();
				incomeType.name = income.newType;
				incomeType.$save(createIncome);
			} else {
				createIncome(income.type);
			}
		};
	});

	app.controller('ObligationsController', function ($scope, api, $uibModal) {

		var init = function () {
			$scope.obligations = api.Obligation.query();
		};

		init();

		$scope.currentPage = 1;

		$scope.filteredObligations = function () {
			var obligations = $scope.obligations;
			var currentPage = $scope.currentPage;
			$scope.totalObligations = obligations.length;
			return obligations.slice((currentPage - 1) * 10, currentPage * 10);
		};

		$scope.obligations.$promise.then(function (obligations) {
			$scope.totalObligations = obligations.length;
			$scope.totalObligation = obligations.reduce(function (sum, obligation) {
				return sum + obligation.amount;
			}, 0);
		});

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

		vm.users = api.User.query();

		vm.obligationTypes = api.ObligationType.query();

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
				if (vm.recurring) {
					userObligation.startDate = vm.periodStart.format('YYYY-MM-DD');
					userObligation.endDate = vm.periodEnd.format('YYYY-MM-DD');
					return api.User.addRecurringObligation({id: user.id, obligationId: obligation.id}, userObligation).$promise;
				}
				return api.User.addObligation({id: user.id, obligationId: obligation.id}, userObligation).$promise;
			};
		};

		vm.save = function (vm) {
			var createObligation = function (obligationType) {
				var o = new api.Obligation();
				o.obligationType = obligationType;
				o.description = vm.description;
				o.amount = totalAmount(vm);
				var date = moment(vm.date, 'DD/MM/YYYY');
				if (date.isValid()) {
					o.date = date.format('YYYY-MM-DD');
				}
				o.$save(function (obligation) {
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
				var obligationType = new api.ObligationType();
				obligationType.name = vm.newType;
				obligationType.$save(createObligation);
			} else {
				createObligation(vm.type);
			}
		};
	});

}(window.angular));
