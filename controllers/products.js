var mongoose = require('mongoose');
var Product = mongoose.model('Product');

exports.all = function(req, res){
  Product.find({},function(err, products) {
      res.send(products);
  });
}

exports.save = function(req, res){
  var reqProduct = req.body.product;
  var product = {
    name: reqProduct.name,
    price: reqProduct.price,
    quantity: reqProduct.quantity
  };
  var id = reqProduct._id || null;
  Product.findByIdAndUpdate(id, product, {upsert: true}, function(err, product){
    if(err){res.send({status: err});return;}
    res.send(product);
  });
}

exports.remove = function(req, res){
    Product.remove({_id: req.body.id}, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}