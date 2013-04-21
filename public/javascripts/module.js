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

app.factory('localTransactions',function($window){
  return {
    get: function(){
      var transactions = JSON.parse($window.localStorage.getItem("transactions")) || [];
      $window.localStorage.removeItem("transactions");
      return transactions;
    },
    save: function(transactions){
      $window.localStorage.setItem("transactions", JSON.stringify(transactions));
    },
    add: function(transaction){
      if(transaction == null)
        return;
      var transactions = this.get();
      if(transactions.indexOf(transaction) === -1)
          transactions.push(transaction);
      this.save(transactions);
    },
    remove: function(transaction){
      var transactions = this.get();
      if(transactions.indexOf(transaction) !== -1)
        transactions.splice(transactions.indexOf(transaction), 1);
      this.save(transactions);
    }
  }
});

app.factory('invalidTransactions',function($window){
  return {
    get: function(){
      var transactions = JSON.parse($window.localStorage.getItem("invalidTransactions")) || [];
      $window.localStorage.removeItem("invalidTransactions");
      return transactions;
    },
    save: function(transactions){
      $window.localStorage.setItem("invalidTransactions", JSON.stringify(transactions));
    },
    add: function(transaction){
      if(transaction == null)
        return;
      var transactions = this.get();
      if(transactions.indexOf(transaction) === -1)
          transactions.push(transaction);
      this.save(transactions);
    },
    remove: function(transaction){
      var transactions = this.get();
      if(transactions.indexOf(transaction) !== -1)
        transactions.splice(transactions.indexOf(transaction), 1);
      this.save(transactions);
    }
  }
});

app.factory('api', function($http, $window, $rootScope, localTransactions, invalidTransactions){
  return {
    init: function(){
      var that = this;
      var submitInvalidTransactions = function(){
        var invalid = invalidTransactions.get();
        console.log("We have "+invalid.length+" invalid transactions");
        invalid.forEach(function(transaction){
          that.invalid(transaction,function(){});
        });
      }
      var submitTransactions = function(){
        var transactions = localTransactions.get();
        console.log("We have "+transactions.length+" transactions");
        transactions.forEach(function(data){
          that.transaction(data, function(){});
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
        localTransactions.add(data);
        callback({status: "success", transaction: {time: new Date(), user: data.user, products: data.products, type: data.type, invalid: false}});
      }
      if($window.navigator.onLine){
        $http.post("/transaction", data).success(function(response){
          localTransactions.remove(data);
          callback(response);
        }).error(saveLocal);
      }
      else{
        saveLocal();
      }
    },
    invalid: function(transaction, callback){
      var saveLocal = function(){
        invalidTransactions.add(transaction);
        callback();
      }
      if($window.navigator.onLine){
        $http.post("/transaction/invalid", {id: transaction._id}).success(function(){
          invalidTransactions.remove(transaction);
          callback();
        }).error(saveLocal);
      }
      else{
        saveLocal();
      }
    }
  }
});