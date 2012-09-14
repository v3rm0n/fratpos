//Admin liides
exports.index = function(req,res){
    var users = require('../models/users');
    users.getAll(function(err,docs){
        var transactions = require('../models/transactions');
        transactions.getAll(function(err,trans){
            var products = require('../models/products');
            products.getAll(function(err,prods){
                res.render('admin', {title: 'Admin', users: docs, transactions: trans, products: prods});
            });
        });
    });
}

exports.warehouse = function(req,res){
    var products = require('../models/products');
    products.changeQuantity(req.body.name, req.body.quantity);
    res.redirect('/admin#warehouse');
}