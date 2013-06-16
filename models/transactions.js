/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var ProductSchema = require('./products');

var TransactionSchema = new Schema(
    {
        time: {type: Date, required: true},
        user: {type: Schema.Types.Mixed, required: true},
        type: {type: String, required: true},
        products : {type: [ProductSchema], required: true},
        invalid: {type: Boolean, required: true}
    },
    {
        toJSON: {virtuals: true}
    }
);

TransactionSchema.pre('save', function (next) {
    var User = mongoose.model('User');
    console.log('Finding user by id: ' + this.userid);
    User.findById(this.userid, function (err, user) {
        this.user = user;
        next(err);
    });
});

TransactionSchema.virtual('formattedTime').get(function () {
    var time = this.time,
        hours = time.getHours() > 9 ? time.getHours() : '0' + time.getHours(),
        minutes = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes(),
        date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate(),
        month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
    return hours + ':' + minutes + ' ' + date + '.' + month + '.' + time.getFullYear();
});

TransactionSchema.virtual('sum').get(function () {
    var sum = 0, i;
    for (i = 0; i < this.products.length; i += 1) {
        sum += Number(this.products[i].price) * Number(this.products[i].quantity);
    }
    return sum;
});

var incrementBalance = function (transaction, cb) {
    console.log('Updating user balance');
    var Paytype = mongoose.model('Paytype');
    Paytype.findByName(transaction.type, function (err, paytype) {
        if (err) {cb(err); return; }
        if (paytype.affectsBalance) {
            var User = mongoose.model('User');
            User.incrementBalance(transaction.user._id, transaction.sum, cb);
        } else {
            cb();
        }
    });
};

var updateProductQuantities = function (transaction, cb) {
    console.log('Updating product quantities');
    var Product = mongoose.model('Product');
    async.each(transaction.products, Product.incrementQuantity.bind(Product), cb);
};

TransactionSchema.method('invalidate', function (cb) {
    var transaction = this;
    console.log('Marking transaction ' + transaction.id + ' invalid');
    this.update({invalid: true}, function (err) {
        if (err) {cb(err); return; }
        async.series([
            async.apply(incrementBalance, transaction),
            async.apply(updateProductQuantities, transaction)
        ], cb);
    });
});

module.exports = TransactionSchema;

mongoose.model('Transaction', TransactionSchema);