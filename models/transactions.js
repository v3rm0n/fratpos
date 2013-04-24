var db = require('./db');
var transactions = db.collection('transactions');
var users = require('../models/users');
var products = require('../models/products');
var paytypes = require('../models/paytypes');
var async = require('async');

exports.getAll = function(callback) {
    exports.getWithFilter({}, callback);
}

exports.get = function(id,callback){
    transactions.findOne({_id: db.ObjectId(id)}, function(err, transaction){
        addMissingInfo(transaction, callback);
    });
}

exports.getWithFilter = function(filter, callback){
    transactions.find(filter).sort({time: -1},function(err,transactions){
        if(err != null){
            callback(err);
            return;
        }
        async.map(transactions, addMissingInfo, function(err,transactions){
            callback(err,transactions);
        });
    });
}

var addMissingInfo = function(item, callback){
    exports.formatTime(item);
    item.sum = exports.getTransactionSum(item);
    item.user = users.getUserFullName(item.user);
    callback(null, item);
}

exports.formatTime = function(transaction){
    var time = new Date(transaction.time);
    var hours = time.getHours() > 9 ? time.getHours() : '0'+time.getHours();
    var minutes = time.getMinutes() > 9 ? time.getMinutes() : '0'+time.getMinutes();
    var date = time.getDate() > 9 ? time.getDate() : '0'+time.getDate();
    var month = time.getMonth()+1 > 9 ? time.getMonth()+1 : '0'+(time.getMonth()+1);
    transaction.formattedTime = hours+':'+minutes+' '+date+'.'+month+'.'+time.getFullYear();
}

exports.save = function(transaction, callback){
    transactions.save(transaction,function(err){
        callback(err,exports.getTransactionSum(transaction), transaction._id);
    });
}

exports.remove = function(callback){
    console.log('Removing all transactions');
    transactions.remove(callback);
}

exports.getTransactionSum = function(transaction){
    var sum = 0;
    for(var i = 0;i< transaction.products.length;i++){
        sum += Number(transaction.products[i].price) * Number(transaction.products[i].quantity);
    }
    return sum;
}

exports.invalid = function(id, callback){
    console.log('Marking transaction '+id+' invalid');
    async.series({
        transaction: function(callback){
            transactions.findOne({_id: db.ObjectId(id), invalid: false}, callback);
        },
        update: function(callback){
            transactions.update({_id: db.ObjectId(id)}, {$set: {invalid: true}}, callback);
        }},
        function(err, result){
            if(err || result.transaction == null){callback(err);return;}
            paytypes.get(result.transaction.type, function(err, paytype){
                if(err){callback(err);return;}
                async.series([
                    async.apply(incrementBalance, result.transaction, paytype),
                    async.apply(updateProductQuantities, result.transaction, paytype)
                    ], callback);
            });
        });
}

var incrementBalance = function(transaction, paytype, callback) {
    console.log('Updating user balance');
    if(paytype.affectsBalance){
        var sum = exports.getTransactionSum(transaction);
        if(paytype.credit)
            sum = -sum;
        users.incrementBalance(transaction.user._id, sum, callback);
    }
    else{
        callback();
    }
}

var updateProductQuantities = function(transaction, paytype, callback) {
    if(paytype.affectsQuantity){
        console.log('Updating product quantities');
        var incQuantity = function(product, callback){
            products.incQuantity(product.name, product.quantity, callback);
        }
        async.each(transaction.products,incQuantity, callback);
        return;
    }
    callback();
}