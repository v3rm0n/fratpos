/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var Transaction = mongoose.model('Transaction');

describe('Transactions', function () {
    var testtransaction = null;

    beforeEach(function (done) {
        var transaction = new Transaction({
            time: new Date(),
            user: null,
            type: "",
            products : [],
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