var transactions = require('../models/transactions');
var products = require('../models/products');
//Kassa
exports.index = function(req, res){
    transactions.getAll(function(err,trans){
        products.getAll(function(err,prods){
            res.render('index', { title: 'Kassa', transactions: trans, products: prods});
        });
    });
};

exports.transaction = function(req,res){
    var transaction = {
        time: new Date(),
        user: req.body.user,
        products: req.body.products,
        type: req.body.type
    }
    transactions.save(transaction, function(err,sum){
        var end = function(err){
            res.send({status: err == null ? 'success' : err, sum: sum});
        }
        if(err == null){
            decrementProducts(transaction.products,end);
        }
        else {
            end(err);
        }
    });
}

var decrementProducts = function(prods, callback){
    var callbacks = prods.length;
    for(var i = 0; i<prods.length; i++){
        var product = prods[i];
        products.incQuantity(product.name,-product.quantity, function(err){
            callbacks--;
            if(callbacks == 0){
                callback(err);
            }
        });
    }
}