var app = angular.module('fratpos', ['ui.bootstrap'])
.config(function($routeProvider){
  $routeProvider
  .when("/users", {templateUrl: "/admin/users"})
  .when("/transactions", {templateUrl: "/admin/transactions"})
  .when("/products", {templateUrl: "/admin/products"})
  .when("/paytypes", {templateUrl: "/admin/paytypes"})
  .when("/statuses", {templateUrl: "/admin/statuses"})
  .when("/stocktakings", {templateUrl: "/admin/stocktakings"})
  .otherwise({redirectTo: "/users"});
});

app.factory('api', function($http, $window){
  return {
    init: function(scope){
      var that = this;
      $window.addEventListener("online", function(){
        that.posdata(function(data){
          scope.users = data.users;
          scope.transactions = data.transactions;
          scope.products = data.products;
          scope.paytypes = data.paytypes;
        });
      });
    },
    posdata: function(callback){
      if($window.navigator.onLine){
        $http.get("/posdata").success(function(data){
          console.log('success');
          $window.localStorage.setItem("posdata", data);
          callback(data);
        }).error(function(){console.log('the fuck');});
      }
      else{
        callback($window.localStorage.getItem("posdata"));
      }
    },
    transaction: function(products, type, user, callback){
      var data = {products: products, type: type, user: user};
      if($window.navigator.onLine){
        $http.post("/transaction", data).success(callback);
      }
      else{
        var transactions = $window.localStorage.getItem("transactions") || [];
        transactions.push(data);
        $window.localStorage.setItem("transactions");
        //TODO: Needs more info
        callback({status: "success", transaction: {}});
      }
    },
    invalid: function(transaction, callback){
      if($window.navigator.onLine){
        $http.post("/transaction/invalid", {id: transaction._id}).success(callback);
      }
      else{
        var invalid = $window.localStorage.getItem("invalidTransactions") || [];
        invalid.push(transaction);
        $window.localStorage.setItem("invalidTransactions");
        callback();
      }
    }
  }
});