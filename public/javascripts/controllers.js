function PosController($scope, api, $timeout){

  api.init();

  var getData = function(){
    api.posdata(function(data){
      $scope.users = data.users;
      $scope.transactions = data.transactions;
      $scope.products = data.products;
      $scope.paytypes = data.paytypes;
    });
  }

  getData();
  
  //Update data when browser comes back online.
  $scope.$on("online", getData);

  $scope.intro = function(){
    var opts = {
      nextLabel: "Järgmine",
      prevLabel: "Eelmine",
      skipLabel: "Lõpeta"
    }
    introJs().setOptions(opts).start();
  }

  $scope.selectedProducts = {};


  $scope.showAllProducts = false;

  $scope.toggleShowAllProducts = function(){
    $scope.showAllProducts = !$scope.showAllProducts;
  }

  $scope.filteredProducts = function(){
    if($scope.showAllProducts || $scope.products == undefined)
      return $scope.products;
    return $scope.products.filter(function(product){ return product.quantity > 0;});
  } 

  $scope.changeQuantity = function(product, quantity){
    var selectedProduct = $scope.selectedProducts[product._id];
    if(selectedProduct == null){
      selectedProduct = angular.copy(product);
      selectedProduct.quantity = 0;
      $scope.selectedProducts[product._id] = selectedProduct;
    }
    var newQuantity = selectedProduct.quantity + quantity;
    if(newQuantity >= 0)
      selectedProduct.quantity = newQuantity;
  }

  $scope.quantity = function(product){
    var qty = 0;
    var selectedProduct = $scope.selectedProducts[product._id];
    if(selectedProduct)
      qty = selectedProduct.quantity;
    return " "+qty+" ";
  }

  $scope.sum = function(){
    var sum = 0;
    for(id in $scope.selectedProducts){
      var product = $scope.selectedProducts[id];
      sum += product.price * product.quantity;
    }
    return sum;
  }

  $scope.isDisabled = function(paytype){
    if($scope.user){
        return paytype.allowedForStatus.indexOf($scope.user.status) == -1;
    }
    return true;
  }

  $scope.pay = function(paytype){
    var isEmpty = function(o){
      for (var i in o) {
        if (Object.prototype.hasOwnProperty.call(o, i)){
          return false;
        }
      }
      return true;
    }
    if(!isEmpty($scope.selectedProducts) && $scope.user != null){
      var data = {products: $scope.selectedProducts, type: paytype.name, user: $scope.user};
      api.transaction(data, function(data){
          if(data.status == "success"){
            updateStatus("Tooted läksid edukalt kirja!", false);
            $scope.selectedProducts = {};
            $scope.user = null;
            $scope.transactions.unshift(data.transaction);
          }
          else{
            updateStatus("Viga tehingul: "+data.status, true);
          }
      });
    }
    else{
      updateStatus("Palun vali toode ja kasutaja enne maksmist", true);
    }
  }

  $scope.invalidTransaction = function(transaction){
    var confirmed = window.confirm("Kas oled kindel, et tahad selle tehingu tagasi võtta?");
    if(confirmed){
      api.invalid(transaction, function(){
        updateStatus("Tehing tagasi võetud!", false);
        $scope.transactions = $scope.transactions.filter(function(item){return item._id != transaction._id});
      });
    }
  }

  var updateStatus = function(message, error){
    $scope.statusMessage = message;
    $scope.status = error ? "Viga!" : "Korras!";
    $scope.statusError = error;
    $timeout(function(){
      $scope.status = null;
    },1000);
  }

}

function NavController($scope, $location){
  $scope.isActive = function(page){
    return $location.path() == "/"+page;
  }
}

function UsersController($scope, $http, $dialog){

  $http.get('/users').success(function(data){
    $scope.users = data;
  });

  $scope.filteredUsers = function(){
    var users = $scope.users;
    if($scope.filter != null && $scope.filter.length > 0)
      users = users.filter(function(user){return user.label.toLowerCase().indexOf($scope.filter) != -1;});
    if($scope.sortfield != null){
      var sort = function(a,b){
        if($scope.asc)
          return String(a[$scope.sortfield]).localeCompare(b[$scope.sortfield]);
        else
          return String(b[$scope.sortfield]).localeCompare(a[$scope.sortfield]);
      }
      users = users.sort(sort);
    }
    return users;
  }

  $scope.asc = true; 

  $scope.sort = function(sortfield){
    if($scope.sortfield == sortfield)
      $scope.asc = !$scope.asc;
    $scope.sortfield = sortfield;
  }

  $scope.totalBalance = function(){
    var users = $scope.filteredUsers();
    if(users != null)
      return users.reduce(function(sum, user){ return sum+user.balance;},0);
    return 0;
  }

  $scope.deleteUser = function(user){
    $http.post("/users/remove", {id: user._id}).success(function(){
      $scope.users = $scope.users.filter(function(u){return user._id != u._id});
    });
  }

  $scope.openBalanceDialog = function(user){
    var d = $dialog.dialog({resolve: {object: function(){ return user;}}});
    d.open('/dialog/balance', DialogController).then(function(result){
      if(result){
        $http.post("/users/save",{user: result});
      }
    });
  }

  $scope.openUserDialog = function(user){
    var userWasNull = user == null;
    if(userWasNull){
      user = {};
      user.status = "";
    }
    var d = $dialog.dialog({resolve: {object: function(){return user;}}});
    d.open('/dialog/user', DialogController).then(function(result){
      if(result){
          $http.post("/users/save",{user: result}).success(function(data){
            if(userWasNull)
              $scope.users.push(data);
          });
      }
    });
  }

}

function TransactionsController($scope, $http){
  $http.get('/transactions').success(function(data){
    $scope.transactions = data;
  });

  $scope.totalSum = function(){
    var transactions = $scope.transactions;
    if(transactions != null)
      return transactions.reduce(function(sum, transaction){ 
        if(!transaction.invalid)
          return sum+transaction.sum;
        return sum;
      },0);
    return 0;
  }

  $scope.invalidTransaction = function(transaction){
    var confirmed = window.confirm("Kas oled kindel, et tahad selle tehingu katkestada?");
    if(confirmed){
      $http.post("/transaction/invalid", {id: transaction._id})
      .success(function(data){
        transaction.invalid = true;
      });
    }
  }
}

function ProductsController($scope, $http, $dialog){
  $http.get("/products").success(function(data){
    $scope.products = data;
  });

  $scope.totalProducts = function(){
    if($scope.products != null)
      return $scope.products.reduce(function(sum, product){ return sum+product.quantity;},0);
    return 0;
  }

  $scope.sortedProducts = function(){
    var products = $scope.products;
    if($scope.sortfield != null){
      var sort = function(a,b){
        if($scope.asc)
          return String(a[$scope.sortfield]).localeCompare(b[$scope.sortfield]);
        else
          return String(b[$scope.sortfield]).localeCompare(a[$scope.sortfield]);
      }
      products = products.sort(sort);
    }
    return products;
  }

  $scope.asc = true; 

  $scope.sort = function(sortfield){
    if($scope.sortfield == sortfield)
      $scope.asc = !$scope.asc;
    $scope.sortfield = sortfield;
  }

  $scope.deleteProduct = function(product){
    $http.post("/products/remove", {id: product._id}).success(function(){
      $scope.products = $scope.products.filter(function(u){return product._id != u._id});
    });
  }

  $scope.openProductDialog = function(product){
    var d = $dialog.dialog({resolve: {object: function(){return product;}}});
    d.open('/dialog/product', DialogController).then(function(result){
      if(result){
          $http.post("/products/save",{product: result}).success(function(data){
            if(product == null)
              $scope.products.push(data);
          });
      }
    });
  }
}

function PaytypesController($scope, $http, $dialog){
  $http.get("/paytypes").success(function(data){
    $scope.paytypes = data;
  });

  $scope.deletePaytype = function(paytype){
    $http.post("/paytypes/remove", {id: paytype._id}).success(function(){
      $scope.paytypes = $scope.paytypes.filter(function(u){return paytype._id != u._id});
    });
  }

  $scope.openPaytypeDialog = function(paytype){
    var d = $dialog.dialog({resolve: {object: function(){return paytype;}}});
    d.open('/dialog/paytype', DialogController).then(function(result){
      if(result){
          $http.post("/paytypes/save",{paytype: result}).success(function(data){
            if(paytype == null)
              $scope.paytypes.push(data);
          });
      }
    });
  }
}

function StatusesController($scope, $http, $dialog){
  $http.get("/statuses").success(function(data){
    $scope.statuses = data;
  });

  $scope.deleteStatus = function(status){
    $http.post("/statuses/remove", {id: status._id}).success(function(){
      $scope.statuses = $scope.statuses.filter(function(u){return status._id != u._id});
    });
  }

  $scope.openStatusDialog = function(status){
    var d = $dialog.dialog({resolve: {object: function(){return status;}}});
    d.open('/dialog/status', DialogController).then(function(result){
      if(result){
          $http.post("/statuses/save",{status: result}).success(function(data){
            if(status == null)
              $scope.statuses.push(data);
          });
      }
    });
  }
}

function StocktakingController($scope, $http, $window){
  $http.get("/stocktakings").success(function(data){
    $scope.stocktakings = data;
  });

  $scope.download = function(stocktaking){
    $window.open("/stocktakings/csv/"+stocktaking._id);
  }

  $scope.view = function(stocktaking){
    $window.open("/stocktakings/html/"+stocktaking._id);
  }

  $scope.stocktaking = function(){
    var confirmed = window.confirm("Oled kindel, et tahad teha inventuuri? Kasutajate saldod nullitakse ja tehingud eemaldatakse.");
    if(confirmed){
      $http.post("/stocktakings/generate").success(function(data){
          $scope.stocktakings.push(data);
      });
    }
  }
}

function DialogController($scope, $http, dialog, object){

  $scope.object = object;
  $scope.change = object != null;

  $http.get("/statuses").success(function(data){
    $scope.statuses = data;
    if($scope.object.status == "" && $scope.statuses.length > 0){
      $scope.object.status = $scope.statuses[0].name;
    }
  });

  $scope.updateForStatus = function(status){
    if($scope.object.allowedForStatus == null)
      $scope.object.allowedForStatus = [];
    if($scope.object.allowedForStatus.indexOf(status.name) == -1 && status.checked){
      $scope.object.allowedForStatus.push(status.name);
    }
    else if($scope.object.allowedForStatus.indexOf(status.name) != -1 && !status.checked){
      $scope.object.allowedForStatus = $scope.object.allowedForStatus.filter(function(s){return s.name != status.name});
    }
  }

  $scope.close = function(){
    dialog.close(null);
  }

  $scope.save = function(object){
    dialog.close(object);
  }
}