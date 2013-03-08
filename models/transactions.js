var db = require('./db');
var transactions = db.collection('transactions');
var users = require('../models/users');
var products = require('../models/products');

exports.getAll = function(callback){
    transactions.find({hidden: false}).sort({time: -1},function(err,docs){
        docs.map(function(item){ 
            item.sum = exports.getTransactionSum(item);
            users.get(item.user, function(err, user){
                item.user = users.getUserFullName(user);
            });
        });
        callback(err,docs);
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
    transactions.update({_id: db.ObjectId(id)}, {$set: {invalid: true}}, function(err){
        if(err != null){
            callback(err);
            return;
        }
        incrementBalance(id, function(err){
            if(err != null){
                callback(err);
                return;
            }
            updateProductQuantities(id, function(err){
                callback(err);
            });
        });
    });
}

var incrementBalance = function(transactionId, callback) {
    console.log('Updating user balance');
    transactions.findOne({_id: db.ObjectId(transactionId)}, function(err, transaction){
        if(err != null) {
            callback(err);
            return;
        }
        var sum = exports.getTransactionSum(transaction);
        users.incrementBalance(transaction.user, sum, callback);
    });
}

var updateProductQuantities = function(transactionId, callback) {
    console.log('Updating product quantities');
    transactions.findOne({_id: db.ObjectId(transactionId)}, function(err, transaction){
        if(err != null) {
            callback(err);
            return;
        }
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
    });
}