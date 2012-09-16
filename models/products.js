var db = require('./db');
var products = db.collection('products');

exports.getAll = function(callback){
    products.find(callback);
}

exports.save = function(product,callback){
    console.log(product);
    products.save(product,callback);
}

exports.updateQuantity = function(name,quantity, callback){
    console.log('Updating product '+name+' quantity to '+quantity);
    products.update({name: name}, {$set: {quantity: quantity}}, callback);
}

exports.incQuantity = function(name,quantity,callback){
    console.log('Incrementing product '+name+' quantity by '+quantity);
    products.update({name: name}, {$inc: {quantity: quantity}}, callback);
}

exports.remove = function(id, callback){
    console.log('Removing product '+id);
    products.remove({_id: db.ObjectId(id)},callback);
}