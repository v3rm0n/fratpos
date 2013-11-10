/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = require('./users');
var TransactionSchema = require('./transactions');
var ProductSchema = require('./products');

var StocktakingSchema = new Schema(
    {
        time: {type: Date, required: true},
        users: {type: [UserSchema]},
        transactions: {type: [TransactionSchema]},
        products: {type: [ProductSchema]}
    },
    {
        toJSON: {virtuals: true}
    }
);

StocktakingSchema.virtual('formattedTime').get(function () {
    var time = this.time,
        hours = time.getHours() > 9 ? time.getHours() : '0' + time.getHours(),
        minutes = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes(),
        date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate(),
        month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
    return hours + ':' + minutes + ' ' + date + '.' + month + '.' + time.getFullYear();
});

StocktakingSchema.virtual('balancesSum').get(function () {
    return this.users.reduce(function (sum, user) {
        return (sum += user.balance);
    }, 0);
});

StocktakingSchema.virtual('transactionsSum').get(function () {
    return this.transactions.reduce(function (sum, transaction) {
        if (!transaction.invalid) {
            return (sum += transaction.sum);
        }
        return sum;
    }, 0);
});

StocktakingSchema.virtual('productsQuantity').get(function () {
    return this.products.reduce(function (qty, product) {
        return (qty += product.quantity);
    }, 0);
});

StocktakingSchema.virtual('sums').get(function () {
    var sums = {};
    this.transactions.forEach(function (transaction) {
        if (!transaction.invalid) {
            var sum = sums[transaction.type] || 0;
            sum += transaction.sum;
            sums[transaction.type] = sum;
        }
    });
    return sums;
});

StocktakingSchema.method('getPrevious', function (cb) {
    this.model('Stocktaking').findOne().where('time').lt(this.time).sort({time: -1}).exec(cb);
});

module.exports = StocktakingSchema;

mongoose.model('Stocktaking', StocktakingSchema);
