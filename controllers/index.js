/*jslint node: true nomen: true*/
"use strict";

var async = require('async'),
    nconf = require('../lib/nconf');

//Models
var mongoose = require('mongoose'),
    Transaction = mongoose.model('Transaction'),
    Product = mongoose.model('Product'),
    Paytype = mongoose.model('Paytype'),
    User = mongoose.model('User');

//Kassa
exports.index = function (req, res) {
    res.render('index', { title: 'Kassa', manifest: 'app.cache'});
};

var invalidateTransaction = function (id, password, res) {
    var isTimedOut = function (transaction) {
        var timeout = nconf.get('timeout') * 1000,
            time = transaction.time.getTime(),
            current = new Date().getTime();
        return current - time > timeout;
    };
    console.log('Invalidating transaction: ' + id);
    Transaction.findById(id, function (err, transaction) {
        if (isTimedOut(transaction)) {
            if (password !== nconf.get('admin:password')) {
                res.send({status: "Transaction has timed out!"});
                return;
            }
        }
        console.log('Transaction already invalid: ' + transaction.invalid);
        if (!transaction.invalid) {
            transaction.invalidate(function (err) {
                res.send({status: err === null ? 'success' : err});
            });
        } else {
            res.send({status: 'success'});
        }
    });
};

exports.invalidAdmin = function (req, res) {
    var password = nconf.get('admin:password');
    invalidateTransaction(req.body.id, password, res);
};

exports.invalid = function (req, res) {
    invalidateTransaction(req.body.id, req.body.password, res);
};

exports.posdata = function (req, res) {
    async.parallel({
        transactions: function (cb) {Transaction.find({invalid: false}, cb); },
        products: function (cb) {Product.find(cb); },
        paytypes: function (cb) {Paytype.find(cb); },
        users: function (cb) {User.find(cb); }
    }, function (err, result) {
        res.send({transactions: result.transactions, products: result.products, paytypes: result.paytypes, users: result.users});
    });
};

var isPaymentTypeAllowed = function (req, cb) {
    Paytype.findByName(req.body.type, function (err, paytype) {
        if (err) {cb(err); return; }
        cb(null, paytype.isAllowedForStatus(req.body.user.status));
    });
};

var decrementProductsAndBalance = function (transaction, cb) {
    Paytype.findByName(transaction.type, function (err, paytype) {
        if (err) {cb(err); return; }
        var decrement = function (product, cb) {
            if (paytype.affectsQuantity) {
                var quantity = product.quantity;
                if (!paytype.credit) {
                    quantity = -quantity;
                }
                Product.incrementQuantity(product, quantity, cb);
                return;
            }
            cb();
        };
        async.each(transaction.products, decrement, function (err) {
            if (paytype && paytype.affectsBalance) {
                var sum = -transaction.sum;
                if (paytype.credit) {
                    sum = -sum;
                }
                User.incrementBalance(transaction.user._id, sum, cb);
            } else {
                cb(err);
            }
        });
    });
};

var createTransaction = function (req, cb) {
    var products = [],
        i,
        transaction = new Transaction({
            time: new Date(),
            user: req.body.user,
            products: products,
            type: req.body.type,
            invalid: false
        });
    for (i = 0; i < req.body.products.length; i += 1) {
        products.push(req.body.products[i]);
    }
    transaction.save(function (err, transaction) {
        if (err) {cb(err); return; }
        decrementProductsAndBalance(transaction, function (err) {
            cb(err, transaction);
        });
    });
};

exports.transaction = function (req, res) {
    async.series({
        allowed: async.apply(isPaymentTypeAllowed, req),
        transaction: async.apply(createTransaction, req)
    }, function (err, result) {
        if (err) {
            res.send({status: err});
        } else if (!result.allowed) {
            res.send({status: 'invalid_paytype'});
        } else if (!result.transaction) {
            res.send({status: 'creation_failed'});
        } else {
            res.send({status: 'success', transaction: result.transaction});
        }
    });
};