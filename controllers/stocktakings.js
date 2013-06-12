/*jslint node: true nomen: true*/
"use strict";

var async = require('async');
var fs = require('fs');
var csv = require('csv');
var handlebars = require('handlebars');

var mongoose = require('mongoose');
var Stocktaking = mongoose.model('Stocktaking');
var User = mongoose.model('User');
var Transaction = mongoose.model('Transaction');
var Product = mongoose.model('Product');

exports.all = function (req, res) {
    Stocktaking.find(function (err, stocktakings) {
        res.send(stocktakings);
    });
};

exports.generate = function (req, res) {
    async.parallel({
        users: function (cb) {User.find({balance: {$ne: 0}}, cb); },
        transactions: function (cb) {Transaction.find(cb); },
        products: function (cb) {Product.find(cb); }
    }, function (err, result) {
        if (err) {res.send({status: err}); return; }
        var stocktaking = new Stocktaking({
            time: new Date(),
            users: result.users,
            transactions: result.transactions,
            products: result.products
        });
        stocktaking.save(function (err, stocktaking) {
            if (err) {res.send({status: err}); return; }
            async.parallel([
                async.apply(User.resetBalances.bind(User)),
                async.apply(Transaction.remove.bind(Transaction))
            ], function (err) {
                if (err) {res.send({status: err}); return; }
                res.send(stocktaking);
            });
        });
    });
};

exports.html = function (req, res) {
    async.waterfall([
        function (cb) {Stocktaking.findById(req.params.id, cb); },
        function (stocktaking, cb) {
            stocktaking.getPrevious(function (err, previous) {
                cb(err, {stocktaking: stocktaking, previous: previous});
            });
        }
    ], function (err, result) {
        res.render('stocktaking', { title: 'Inventuur', manifest: null, stocktaking: result.stocktaking, previous: result.previous});
    });
};

var transformStocktakingToCSV = function (id, callback) {
    if (id === null) {callback('Stocktaking cannot be null!', null); return; }
    async.parallel({
        template: function (callback) {
            fs.readFile('./template/stocktaking.js', 'utf8', function (err, data) {
                if (err !== null) {callback(err); return; }
                var template = handlebars.compile(data);
                callback(null, template);
            });
        },
        stocktaking: function (cb) {Stocktaking.findById(id, cb); }
    }, function (err, result) {
        if (err !== null) {callback(err); return; }
        var content = result.template(result.stocktaking);
        callback(null, content);
    });
};

exports.csv = function (req, res) {
    res.type('text/csv');
    transformStocktakingToCSV(req.params.id, function (err, content) {
        csv().from(content).to.stream(res);
    });
};