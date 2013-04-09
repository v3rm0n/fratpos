var products = require('../models/products');
var transactions = require('../models/transactions');
var users = require('../models/users');
var statuses = require('../models/statuses');
var paytypes = require('../models/paytypes');
var async = require('async');
//Admin liides
exports.index = function(req,res){
    async.parallel([
        async.apply(users.getAll),
        async.apply(transactions.getAll),
        async.apply(products.getAll),
        async.apply(paytypes.getAll),
        async.apply(statuses.getAll)
        ],
        function(err, result){
            res.render('admin', 
                {title: 'Admin',
                users: result[0], 
                transactions: result[1], 
                products: result[2],
                paytypes: result[3],
                statuses: result[4]}
            );
        }
    );
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

exports.addStatus = function(req, res) {
    statuses.save({name: req.body.status}, function(err){
        res.redirect('/admin#statuses');
    });
}

exports.removeStatus = function(req, res) {
    statuses.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}