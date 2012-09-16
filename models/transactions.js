var db = require('./db');
var transactions = db.collection('transactions');

exports.getAll = function(callback){
    transactions.find().sort({time: -1},function(err,docs){
        docs.map(function(item){ item.sum = getTransactionSum(item);});
        callback(err,docs);
    });
}

exports.save = function(transaction,callback){
    console.log(transaction);
    transactions.save(transaction,function(err){
        callback(err,getTransactionSum(transaction));
    });
}

var getTransactionSum = function(transaction){
    var sum = 0;
    for(var i = 0;i< transaction.products.length;i++){
        sum += Number(transaction.products[i].price) * Number(transaction.products[i].quantity);
    }
    return sum;
}