/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    quantity: {type: Number, required: true}
});

ProductSchema['static']('incrementQuantity', function (product, amount, cb) {
    if (!cb) {
        cb = amount;
        amount = product.quantity;
    }
    console.log('Incrementing product ' + product._id + ' quantity by ' + amount);
    this.model('Product').update({_id: product._id}, {$inc: {quantity: amount}}, cb);
});

mongoose.model('Product', ProductSchema);

module.exports = ProductSchema;