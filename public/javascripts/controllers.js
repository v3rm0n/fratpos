function PosController($scope, $http, $timeout){

  $scope.selectedProducts = {};

  var transform = function(items, callback, after){
    for(i=0;i<items.length;i++){
      callback(items[i]);
    }
    after(items);
  }

  $http.get("/posdata").success(function(data){
    //Do some transformation before updating the model
    transform(data.users, 
      function(user){
        user.label = user.status+" "+user.firstname+" "+user.lastname+" ("+user.beername+")";
    }, 
      function(users){
        $scope.users = data.users;
    });
    transform(data.transactions, formatTransactionTime,
      function(transactions){
        $scope.transactions = data.transactions;
      });
    $scope.products = data.products;
    $scope.paytypes = data.paytypes;
  });

  var formatTransactionTime = function(transaction){
    var time = new Date(transaction.time);
    var hours = time.getHours() > 9 ? time.getHours() : "0"+time.getHours();
    var minutes = time.getMinutes() > 9 ? time.getMinutes() : "0"+time.getMinutes();
    transaction.formattedTime = hours+":"+minutes;
  }

  $scope.changeQuantity = function(product, quantity){
    var selectedProduct = $scope.selectedProducts[product._id];
    if(selectedProduct == null){
      console.log('new product')
      selectedProduct = angular.copy(product);
      selectedProduct.quantity = 0;
      $scope.selectedProducts[product._id] = selectedProduct;
    }
    var newQuantity = selectedProduct.quantity + quantity;
    console.log('new qty '+newQuantity)
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

  $scope.allowedPaytypes = function(){
    if($scope.user){
      return $scope.paytypes.filter(function(paytype){
        return paytype.allowedForStatus.indexOf($scope.user.status) != -1;
      });
    }
    return $scope.paytypes;
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
      $http.post("/transaction", {products: $scope.selectedProducts, type: paytype.name, user: $scope.user._id})
        .success(function(data){
          if(data.status == "success"){
            updateStatus("Tooted läksid edukalt kirja!", false);
            $scope.selectedProducts = {};
            formatTransactionTime(data.transaction);
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
      $http.post("/transaction/invalid", {id: transaction._id})
      .success(function(data){
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