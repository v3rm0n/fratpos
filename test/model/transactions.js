/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var Transaction = mongoose.model('Transaction'),
    User = mongoose.model('User'),
    Product = mongoose.model('Product'),
    Paytype = mongoose.model('Paytype');

describe('Transactions', function () {
    var testtransaction = null;

    beforeEach(function (done) {
        var user = new User({
            firstname: 'Test',
            lastname: 'Test'
        }),
            paytype = new Paytype({
                name: 'Cash',
                allowedForStatus: ["!reb"]
            }),
            product = new Product({
                name: "Test",
                price: 1.4
            }),
            transaction = new Transaction({
                time: new Date(),
                user: user,
                type: paytype.name,
                products : [product],
                invalid: false
            });
        transaction.save(function (err, transaction) {
            testtransaction = transaction;
            done();
        });
    });

    afterEach(function (done) {
        Transaction.remove({}, done);
    });

    it('should find transactions', function (done) {
        Transaction.find({time: testtransaction.time}, function (err, transactions) {
            transactions.length.should.equal(1);
            transactions[0].formattedTime.should.equal(testtransaction.formattedTime);
            done();
        });
    });

    //TODO: more tests here

});