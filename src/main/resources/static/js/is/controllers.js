/*jslint es5: true nomen: true forin: true vars: true*/
(function (angular) {
	"use strict";

	var app = angular.module('fratis');

	app.controller('UsersController', function ($scope, $modal, $window, api) {

		$scope.users = api.User.query();

		$scope.filteredUsers = function () {
			var users = $scope.users;
			if ($scope.filter !== undefined && $scope.filter.length > 0) {
				users = users.filter(function (user) {
					return user.label.toLowerCase().indexOf($scope.filter.toLowerCase()) !== -1;
				});
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
				return users.reduce(function (sum, user) {
					return sum + user.balance;
				}, 0);
			}
			return 0;
		};

		$scope.openUserDialog = function (user) {

			api.Status.query(function (statuses) {

				var modalScope = $scope.$new();
				modalScope.user = angular.copy(user) || new api.User();
				modalScope.statuses = statuses;

				var i;
				for (i = 0; i < statuses.length; i += 1) {
					if (modalScope.user.status === undefined || (user && statuses[i].id === user.status.id)) {
						modalScope.user.status = statuses[i];
						break;
					}
				}

				var d = $modal({
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
					var confirmed = $window.confirm('Oled kindel, et tahad kasutaja kustutada?');
					if (confirmed) {
						user.$remove(function () {
							$scope.users = $scope.users.filter(function (u) {
								return user.id !== u.id;
							});
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
				return $scope.products.reduce(function (sum, product) {
					return sum + product.quantity;
				}, 0);
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

		$scope.rowColor = function (product) {
			return product.quantity <= 0 ? 'red' : '';
		};

		$scope.openProductDialog = function (product) {

			var modalScope = $scope.$new();
			modalScope.product = angular.copy(product) || new api.Product();

			var d = $modal({
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
				var confirmed = $window.confirm('Oled kindel, et tahad toote kustutada?');
				if (confirmed) {
					product.$remove(function () {
						$scope.products = $scope.products.filter(function (u) {
							return product.id !== u.id;
						});
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

				var modalScope = $scope.$new();
				modalScope.paytype = angular.copy(paytype) || new api.Paytype();
				modalScope.statuses = statuses;
				modalScope.checked = {};
				modalScope.allowedForStatus = {};

				if (paytype !== undefined) {
					paytype.allowedForStatus.forEach(function (status) {
						modalScope.allowedForStatus[status.id] = true;
					});
				}

				var d = $modal({
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
							$scope.paytypes = $scope.paytypes.filter(function (u) {
								return paytype.id !== u.id;
							});
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

			var modalScope = $scope.$new();
			modalScope.status = angular.copy(status) || new api.Status();

			var d = $modal({
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
				var confirmed = $window.confirm('Oled kindel, et tahad staatuse kustutada?');
				if (confirmed) {
					status.$remove(function () {
						$scope.statuses = $scope.statuses.filter(function (u) {
							return status.id !== u.id;
						});
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
			var confirmed = $window.confirm('Oled kindel, et tahad teha inventuuri? Kasutajate saldod nullitakse ja tehingud eemaldatakse.');
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

		api.Stocktaking.get({id: $routeParams.id - 1}, function (previous) {
			$scope.previous = previous;
			console.log(previous);
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
				$scope.feedbacks = $scope.feedbacks.filter(function (u) {
					return feedback.id !== u.id;
				});
			});
		};
	});

	app.controller('ProfileController', function ($scope, api, $routeParams) {

		if ($routeParams.id) {
			$scope.user = api.User.get({id: id});
		} else {
			$scope.user = api.User.me();
		}

	});

	app.controller('RoleController', function ($scope, api) {

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
				initRoles();
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
		};

		$scope.change = function (permission, role, checked) {
			$scope.changedPermissions[permission.id] = $scope.changedPermissions[permission.id] || {};
			$scope.changedPermissions[permission.id][role.id] = checked;
		};

	});

}(this.angular));
