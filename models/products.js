var db = require('./db');
var products = db.collection('products');

exports.getAll = function(callback){
    products.find(callback);
}

exports.save = function(product,callback){
    products.save(product,callback);
}

exports.updateQuantity = function(name,quantity, callback){
    products.update({name: name}, {$set: {quantity: quantity}}, callback);
}

exports.remove = function(id, callback){
    products.remove({_id: db.ObjectId(id)},callback);
}