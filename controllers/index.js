var transactions = require('../models/transactions');
var products = require('../models/products');
var users = require('../models/users');
var paytypes = require('../models/paytypes');
var async = require('async');
//Kassa
exports.index = function(req, res){
    async.parallel([
            async.apply(transactions.getWithFilter,{hidden: false, invalid: false}),
            async.apply(products.getAll),
            async.apply(paytypes.getAll)
        ]
        ,function(err, result){
            res.render('index', { title: 'Kassa', transactions: result[0], products: result[1], paytypes: result[2]});
        });
};

exports.transaction = function(req, res){
    var parseQuantity = function(reqProd, callback){
        reqProd.quantity = Number(reqProd.quantity);
        callback();
    }
    async.each(req.body.products, parseQuantity, function(err){
        if(err != null){
            res.send({status: err});
            return;
        }
        var transaction = {
            time: new Date(),
            user: req.body.user,
            products: req.body.products,
            type: req.body.type,
            invalid: false,
            hidden: false
        }
        transactions.save(transaction, function(err, sum, id){
            var end = function(err){
                res.send({status: err == null ? 'success' : err, sum: sum, id: id});
            }
            err == null ? decrementProductsAndBalance(transaction, end) : end(err);
        });
    });
}

var decrementProductsAndBalance = function(transaction, callback){
    var decrement = function(product, callback){
        products.incQuantity(product.name, -product.quantity, callback);
    }
    async.each(transaction.products, decrement, function(err){
        paytypes.get(transaction.type, function(err, paytype){
            if(paytype && paytype.affectsBalance == true){
                var sum = transactions.getTransactionSum(transaction);
                users.incrementBalance(transaction.user, -sum, callback);
            }
            else {
                callback(err);
            }
        });
    });
}

exports.invalid = function(req, res){
    transactions.invalid(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}