/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');

exports.all = function (req, res) {
    Transaction.find(function (err, transactions) {
        res.send(transactions);
    });
};