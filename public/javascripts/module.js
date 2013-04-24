var app = angular.module('fratpos', ['ui.bootstrap'])
.config(function($routeProvider){
  $routeProvider
  .when('/users', {templateUrl: "/admin/users"})
  .when('/transactions', {templateUrl: "/admin/transactions"})
  .when('/products', {templateUrl: "/admin/products"})
  .when('/paytypes', {templateUrl: "/admin/paytypes"})
  .when('/statuses', {templateUrl: "/admin/statuses"})
  .when('/stocktakings', {templateUrl: "/admin/stocktakings"})
  .otherwise({redirectTo: "/users"});
});

app.factory('localStorage',function($window){
  return {
    get: function(name){
      var items = JSON.parse($window.localStorage.getItem(name)) || [];
      $window.localStorage.removeItem(name);
      return items;
    },
    save: function(items, name){
      $window.localStorage.setItem(name, JSON.stringify(items));
    },
    add: function(item, name){
      if(item == null)
        return;
      var items = this.get(name);
      if(items.indexOf(item) === -1)
          items.push(item);
      this.save(items, name);
    },
    remove: function(item, name){
      var items = this.get(name);
      if(items.indexOf(item) !== -1)
        items.splice(items.indexOf(item), 1);
      this.save(items, name);
    }
  }
});

app.factory('api', function($http, $window, $rootScope, $timeout, localStorage){
  return {
    init: function(){
      var that = this;
      var submitInvalidTransactions = function(callback){
        var invalid = localStorage.get('invalidTransactions');
        console.log('We have '+invalid.length+' invalid transactions');
        var callbacks = invalid.length;
        if(callbacks == 0 && callback != null){
          callback();
          return;
        }
        invalid.forEach(function(transaction){
          that.invalid(transaction,function(){
            callbacks--;
            if(callbacks == 0 && callback != null)
              callback();
          });
        });
      }
      var submitTransactions = function(callback){
        var transactions = localStorage.get('transactions');
        console.log('We have '+transactions.length+' transactions');
        var callbacks = transactions.length;
        if(callbacks == 0 && callback != null){
          callback();
          return;
        }
        transactions.forEach(function(data){
          that.transaction(data, function(){
            callbacks--;
            if(callbacks == 0 && callback != null)
              callback();
          });
        });
      }
      $window.addEventListener('online', function(){
        console.log('Browser is back online');
        $timeout(function(){
          submitInvalidTransactions(function(){
            submitTransactions(function(){
              $rootScope.$broadcast('online');
            });
          });
        },1000);
      });
      submitInvalidTransactions();
      submitTransactions();
    },
    posdata: function(callback){
      if($window.navigator.onLine){
        $http.get('/posdata').success(function(data){
          localStorage.save(data, 'posdata');
          callback(data);
        });
      }
      else{
        var posdata = localStorage.get('posdata');
        callback(posdata);
        localStorage.save(posdata, 'posdata');
      }
    },
    transaction: function(data, callback){
      var saveLocal = function(){
        localStorage.add(data, 'transactions');
        var formatTime = function(transaction){
            var time = new Date(transaction.time);
            var hours = time.getHours() > 9 ? time.getHours() : '0'+time.getHours();
            var minutes = time.getMinutes() > 9 ? time.getMinutes() : '0'+time.getMinutes();
            var date = time.getDate() > 9 ? time.getDate() : '0'+time.getDate();
            var month = time.getMonth()+1 > 9 ? time.getMonth()+1 : '0'+(time.getMonth()+1);
            transaction.formattedTime = hours+':'+minutes+' '+date+'.'+month+'.'+time.getFullYear();
        }
        var getUserFullName = function(user){
            var fullName = user.status + ' ' + user.firstname + ' ' + user.lastname +
            (user.beername != null && user.beername.length > 0 ? ' ('+user.beername+')' : '');
            return fullName;
        }
        var getSum = function(products){
          var sum = 0;
          for(id in products){
            var product = products[id];
            sum += product.price * product.quantity;
          }
          return sum;
        }
        var transaction = {
          time: new Date(),
          user: getUserFullName(data.user), 
          products: data.products,
          sum: getSum(data.products),
          type: data.type, 
          invalid: false
        };
        formatTime(transaction);
        callback({status: 'success', transaction: transaction});
      }
      if($window.navigator.onLine){
        $http.post('/transaction', data).success(function(response){
          localStorage.remove(data, 'transactions');
          callback(response);
        }).error(saveLocal);
      }
      else{
        saveLocal();
      }
    },
    invalid: function(transaction, password, callback){
      if(typeof(password) === 'function'){
        callback = password;
        password = null;
      }
      var saveLocal = function(){
        localStorage.add(transaction, 'invalidTransactions');
        callback();
      }
      if($window.navigator.onLine){
        $http.post('/transaction/invalid', {id: transaction._id, password: password}).success(function(data){
          localStorage.remove(transaction, 'invalidTransactions');
          callback(data);
        }).error(saveLocal);
      }
      else{
        saveLocal();
      }
    }
  }
});