var app = angular.module('fratpos', ['ui.bootstrap'])
.config(function($routeProvider){
  $routeProvider
  .when("/dialog/:name", {templateUrl: "/dialog"})
  .when("/users", {templateUrl: "/admin/users"})
  .when("/transactions", {templateUrl: "/admin/transactions"})
  .when("/products", {templateUrl: "/admin/products"})
  .when("/paytypes", {templateUrl: "/admin/paytypes"})
  .when("/statuses", {templateUrl: "/admin/statuses"})
  .otherwise({redirectTo: "/users"});
});

app.factory('util', function(){
  return {
    transform: function(items, callback, after){
      for(i=0;i<items.length;i++){
        callback(items[i]);
      }
      after(items);
    },
    formatTransactionTime: function(transaction){
      var time = new Date(transaction.time);
      var hours = time.getHours() > 9 ? time.getHours() : "0"+time.getHours();
      var minutes = time.getMinutes() > 9 ? time.getMinutes() : "0"+time.getMinutes();
      transaction.formattedTime = hours+":"+minutes;
    }
  }
});