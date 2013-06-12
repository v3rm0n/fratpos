/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number
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