var db = require('./db');
var stocktakings = db.collection('stocktakings');
var transactions = require('../models/transactions');

exports.getAll = function(callback){
    stocktakings.find(function(err,stocktakings){
      if(stocktakings != null)
        stocktakings.forEach(function(stocktaking){
          stocktaking.transactions.forEach(transactions.formatTime);
          transactions.formatTime(stocktaking);
          addBalancesAndTransactionsSum(stocktaking);
        });
      callback(err,stocktakings);
    });
}

exports.get = function(id,callback){
    stocktakings.findOne({_id: db.ObjectId(id)}, function(err, stocktaking){
      if(stocktaking != null){
        stocktaking.transactions.forEach(transactions.formatTime);
        transactions.formatTime(stocktaking);
        addBalancesAndTransactionsSum(stocktaking);
      }
      callback(err,stocktaking);
    });
}

exports.save = function(stocktaking, callback){
    stocktakings.save(stocktaking, function(err){
      addBalancesAndTransactionsSum(stocktaking);
      callback(err);
    });
}

var addBalancesAndTransactionsSum = function(stocktaking){
  var balancesSum = stocktaking.users.reduce(function(sum, user){return sum+=user.balance;},0);
  var productsQuantity = stocktaking.products.reduce(function(qty, product){return qty+=product.quantity;},0);
  var transactionsSum = stocktaking.transactions.reduce(function(sum,transaction){
    if(!transaction.invalid)
      return sum+=transaction.sum;
    return sum;
  },0);
  stocktaking.balancesSum = balancesSum;
  stocktaking.transactionsSum = transactionsSum;
  stocktaking.productsQuantity = productsQuantity;
}