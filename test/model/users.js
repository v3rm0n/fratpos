/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var should = require('should');
var User = mongoose.model('User');

describe('Users', function () {

    var testuser = null;

    beforeEach(function (done) {
        var user = new User({
            firstname: "Test",
            lastname: "Last",
            beername: "Beer",
            status: "vil!",
            balance: "5"
        });
        user.save(function (err, user) {
            testuser = user;
            done();
        });
    });

    afterEach(function (done) {
        User.remove({firstname: testuser.firstname}, done);
    });

    it('should find users', function (done) {
        User.findOne({firstname: testuser.firstname}, function (err, user) {
            user.firstname.should.equal('Test');
            user.label.should.equal('vil! Test Last (Beer)');
            done();
        });
    });

    it('should reset user balances', function (done) {
        User.resetBalances(function (err) {
            User.findOne({firstname: testuser.firstname}, function (err, user) {
                user.balance.should.equal(0);
                done();
            });
        });
    });

    it('should increment user balance', function (done) {
        User.incrementBalance(testuser._id, 1, function (err) {
            User.findOne({firstname: testuser.firstname}, function (err, user) {
                user.balance.should.equal(6);
                done();
            });
        });
    });

    it('should fail when firstname is missing', function (done) {
        var user = new User({
            lastname: "Last",
            status: "vil!"
        });
        user.save(function (err, user) {
            should.exist(err);
            done();
        });
    });

    it('should fail when lastname is missing', function (done) {
        var user = new User({
            firstname: "First",
            status: "vil!"
        });
        user.save(function (err, user) {
            should.exist(err);
            done();
        });
    });

    it('should fail when status is missing', function (done) {
        var user = new User({
            firstname: "First",
            lastname: "Last"
        });
        user.save(function (err, user) {
            should.exist(err);
            done();
        });
    });
});