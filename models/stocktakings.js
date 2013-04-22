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

exports.get = function(id, callback){
    stocktakings.findOne({_id: db.ObjectId(id)}, parse(callback));
}

exports.getPrevious = function(stocktaking, callback){
    stocktakings.find({time: {$lt: stocktaking.time}}).sort({time: -1}).limit(1, function(err, stocktakings){
      var previous = stocktakings.pop();
      parse(callback)(err,previous);
    });
}

var parse = function(callback){
  return function(err, stocktaking){
    if(stocktaking != null){
      stocktaking.transactions.forEach(transactions.formatTime);
      transactions.formatTime(stocktaking);
      addBalancesAndTransactionsSum(stocktaking);
      addSumsByPaytype(stocktaking);
    }
    callback(err,stocktaking);
  }
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

var addSumsByPaytype = function(stocktaking){
  var sums = {};
  stocktaking.transactions.forEach(function(transaction){
    if(!transaction.invalid){
      var sum = sums[transaction.type] || 0;
      sum += transaction.sum;
      sums[transaction.type] = sum;
    }
  });
  stocktaking.sums = sums;
}