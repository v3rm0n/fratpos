var db = require('./db');
var products = db.collection("products");

exports.getAll = function(callback){
    products.find(callback);
}

exports.save = function(product){
    products.save(product);
}

exports.changeQuantity = function(name,quantity){
    products.update({name: name},{$set: {quantity: quantity}});
}