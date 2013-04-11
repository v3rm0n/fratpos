var products = require('../models/products');

exports.all = function(req, res){
  products.getAll(function(err, products) {
      res.send(products);
  });
}

exports.save = function(req, res){
    var product = req.body.product;
    products.save(product, function(err){
        res.send(product);
    });
}

exports.remove = function(req, res){
    products.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}