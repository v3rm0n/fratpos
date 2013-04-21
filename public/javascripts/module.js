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

app.factory('api', function($http, $window, $rootScope){
  return {
    init: function(){
      var that = this;
      var submitInvalidTransactions = function(){
        var invalid = JSON.parse($window.localStorage.getItem("invalidTransactions")) || [];
        console.log("We have "+invalid.length+" invalid transactions");
        invalid.forEach(that.invalid);
      }
      var submitTransactions = function(){
        var transactions = JSON.parse($window.localStorage.getItem("transactions")) || [];
        console.log("We have "+transactions.length+" transactions");
        transactions.forEach(function(data){
          that.transaction(data.products, data.type, data.user, function(){});
        });
      }
      $window.addEventListener("online", function(){
        console.log("Browser is back online");
        submitInvalidTransactions();
        submitTransactions();
        $rootScope.$broadcast("online");
      });
      submitInvalidTransactions();
      submitTransactions();
    },
    posdata: function(callback){
      if($window.navigator.onLine){
        $http.get("/posdata").success(function(data){
          $window.localStorage.setItem("posdata", JSON.stringify(data));
          callback(data);
        });
      }
      else{
        callback(JSON.parse($window.localStorage.getItem("posdata")));
      }
    },
    transaction: function(data, callback){
      var saveLocal = function(){
        var transactions = JSON.parse($window.localStorage.getItem("transactions")) || [];
        if(transactions.indexOf(data) === -1)
          transactions.push(data);
        $window.localStorage.setItem("transactions", JSON.stringify(transactions));
        callback({status: "success", transaction: {time: new Date(), user: data.user, products: data.products, type: data.type, invalid: false}});
      }
      if($window.navigator.onLine){
        $http.post("/transaction", data).success(function(response){
          var transactions = JSON.parse($window.localStorage.getItem("transactions")) || [];
          if(transactions.indexOf(data) !== -1)
            transactions.splice(transactions.indexOf(data), 1);
          $window.localStorage.setItem("transactions", JSON.stringify(transactions));
          callback(response);
        }).error(saveLocal);
      }
      else{
        saveLocal();
      }
    },
    invalid: function(transaction, callback){
      var saveLocal = function(){
        var invalid = JSON.parse($window.localStorage.getItem("invalidTransactions")) || [];
        invalid.push(transaction);
        $window.localStorage.setItem("invalidTransactions", JSON.stringify(invalid));
        callback();
      }
      if($window.navigator.onLine){
        $http.post("/transaction/invalid", {id: transaction._id}).success(function(){
          var invalid = JSON.parse($window.localStorage.getItem("invalidTransactions")) || [];
          if(invalid.indexOf(transaction) !== -1)
            invalid.splice(invalid.indexOf(transaction), 1);
          $window.localStorage.setItem("invalidTransactions", JSON.stringify(invalid));
          callback();
        }).error(saveLocal);
      }
      else{
        saveLocal();
      }
    }
  }
});