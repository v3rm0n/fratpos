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

app.factory('util', function(){
  return {
    formatTime: function(object){
      var time = new Date(object.time);
      var hours = time.getHours() > 9 ? time.getHours() : "0"+time.getHours();
      var minutes = time.getMinutes() > 9 ? time.getMinutes() : "0"+time.getMinutes();
      var date = time.getDate() > 9 ? time.getDate() : "0"+time.getDate();
      var month = time.getMonth()+1 > 9 ? time.getMonth()+1 : "0"+(time.getMonth()+1);
      object.formattedTime = hours+":"+minutes+" "+date+"."+month+"."+time.getFullYear();
    }
  }
});