var db = require('./db');
var transactions = db.collection("transactions");

exports.getAll = function(callback){
    transactions.find(callback);
}

exports.save = function(transaction){
    transactions.save(transaction);
}