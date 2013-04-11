var products = require('../models/products');

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