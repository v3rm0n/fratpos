var db = require('./db');
var transactions = db.collection('transactions');
var users = require('../models/users');
var products = require('../models/products');
var async = require('async');

exports.getAll = function(callback) {
    exports.getWithFilter({hidden: false}, callback);
}

exports.getWithFilter = function(filter, callback){
    transactions.find(filter).sort({time: -1},function(err,docs){
        if(err != null){
            callback(err);
            return;
        }
        async.map(docs, addSumAndUserToTransaction, function(err,docs){
            callback(err,docs);
        });
    });
}

var addSumAndUserToTransaction = function(item, callback){
    item.sum = exports.getTransactionSum(item);
    users.get(item.user, function(err, user){
        item.user = users.getUserFullName(user);
        callback(null, item);
    });
}

exports.save = function(transaction, callback){
    transactions.save(transaction,function(err){
        callback(err,exports.getTransactionSum(transaction), transaction._id);
    });
}

exports.getTransactionSum = function(transaction){
    var sum = 0;
    for(var i = 0;i< transaction.products.length;i++){
        sum += Number(transaction.products[i].price) * Number(transaction.products[i].quantity);
    }
    return sum;
}

exports.reset = function(callback){
    transactions.update({},{$set: {hidden: true}}, {multi: true}, callback);
}

exports.invalid = function(id, callback){
    console.log('Marking transaction '+id+' invalid');
    transactions.findOne({_id: db.ObjectId(id)}, function(err, transaction){
        if(transaction.invalid){
            callback(err);
        }
        else {
            transactions.update({_id: db.ObjectId(id)}, {$set: {invalid: true}}, function(err){
                if(err != null){
                    callback(err);
                    return;
                }
                incrementBalance(transaction, function(err){
                    if(err != null){
                        callback(err);
                    }
                    else {
                        updateProductQuantities(transaction, function(err){
                            callback(err);
                        });
                    }
                });
            });
        }
    });
}

var incrementBalance = function(transaction, callback) {
    console.log('Updating user balance');
    if(transaction.type == "Sula") {
        callback();
    }
    else {
        var sum = exports.getTransactionSum(transaction);
        users.incrementBalance(transaction.user, sum, callback);
    }
}

var updateProductQuantities = function(transaction, callback) {
    console.log('Updating product quantities');
    var callbacks = transaction.products.length;
    transaction.products.forEach(function(product){
        products.incQuantity(product.name, product.quantity, function(err){
            callbacks--;
            if(callbacks == 0 || err != null){
                callback(err);
                return;
            }
        });
    });
}