var products = require('../models/products');
var transactions = require('../models/transactions');
//Admin liides
exports.index = function(req,res){
    var users = require('../models/users');
    users.getAll(function(err,docs){
        var transactions = require('../models/transactions');
        transactions.getAll(function(err,trans){
            products.getAll(function(err,prods){
                res.render('admin', {title: 'Admin', users: docs, transactions: trans, products: prods});
            });
        });
    });
}

exports.changeProduct = function(req,res){
    if(req.body.name != ''){
        products.updateQuantity(req.body.name, Number(req.body.quantity), function(err){
            res.redirect('/admin#warehouse');
        });
    }
    else{
        var product = {
            name: req.body.newName,
            quantity: Number(req.body.quantity),
            price: Number(req.body.price)
        }
        products.save(product, function(err){
            res.redirect('/admin#warehouse');
        });
    }
}

exports.removeProduct = function(req,res){
    products.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}

exports.reset = function(req,res){
    transactions.reset(function(err){
        res.send({status: err == null ? 'success' : err});
    });
}