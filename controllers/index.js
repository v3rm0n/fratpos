var transactions = require('../models/transactions');
var products = require('../models/products');
var users = require('../models/users');
//Kassa
exports.index = function(req, res){
    transactions.getWithFilter({hidden: true, invalid: false}, function(err,trans){
        products.getAll(function(err,prods){
            res.render('index', { title: 'Kassa', transactions: trans, products: prods});
        });
    });
};

exports.transaction = function(req, res){
    products.getAll(function(err, prods){
        if(err != null){
            res.send({status: err});
            return;
        }
        req.body.products.forEach(function(reqProd){
            reqProd.quantity = Number(reqProd.quantity);
            prods.forEach(function(prod){
                if(prod.name === reqProd.name){
                    reqProd.price = req.body.type != "Rebaseõlu" ? prod.price : 0;
                }
            });
        });
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
    var prods = transaction.products;
    var callbacks = prods.length;
    for(var i = 0; i<prods.length; i++){
        var product = prods[i];
        products.incQuantity(product.name,-product.quantity, function(err){
            callbacks--;
            if(callbacks == 0){
                var sum = transactions.getTransactionSum(transaction);
                if(transaction.type != "Sula"){
                    users.incrementBalance(transaction.user, -sum, callback);
                }
                else {
                    callback(err);
                }
            }
            else if(err != null){
                callback(err);
                return;
            }
        });
    }
}

exports.invalid = function(req, res){
    transactions.invalid(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}