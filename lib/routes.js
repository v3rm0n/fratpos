/*jslint node: true*/
"use strict";

var index = require('../controllers/index'),
    admin = require('../controllers/admin'),
    users = require('../controllers/users'),
    transactions = require('../controllers/transactions'),
    products = require('../controllers/products'),
    statuses = require('../controllers/statuses'),
    paytypes = require('../controllers/paytypes'),
    stocktakings = require('../controllers/stocktakings'),
    passport = require('./passport');

module.exports = function (app) {
    //Pos view
    app.get('/', passport.authPos, index.index);

    //Pos actions
    app.get('/posdata', passport.authPos, index.posdata);
    app.post('/transaction', passport.authPos, index.transaction);
    app.post('/transaction/invalid', passport.authPos, index.invalid);

    //Admin view
    app.get('/admin', passport.authAdmin, admin.index);

    //Partials
    app.get('/admin/:page', passport.authAdmin, admin.page);
    app.get('/dialog/:dialog', passport.authAdmin, admin.dialog);

    //Admin actions

    //Users
    app.get('/users', passport.authAdmin, users.all);
    app.post('/users/save', passport.authAdmin, users.save);
    app.post('/users/remove', passport.authAdmin, users.remove);

    //Transactions
    app.get('/transactions', passport.authAdmin, transactions.all);
    app.post('/transaction/invalid/admin', passport.authAdmin, index.invalidAdmin);

    //Products
    app.get('/products', passport.authAdmin, products.all);
    app.post('/products/save', passport.authAdmin, products.save);
    app.post('/products/remove', passport.authAdmin, products.remove);

    //Statuses
    app.get('/statuses', passport.authAdmin, statuses.all);
    app.post('/statuses/save', passport.authAdmin, statuses.save);
    app.post('/statuses/remove', passport.authAdmin, statuses.remove);

    //Paytypes
    app.get('/paytypes', passport.authAdmin, paytypes.all);
    app.post('/paytypes/save', passport.authAdmin, paytypes.save);
    app.post('/paytypes/remove', passport.authAdmin, paytypes.remove);

    //Stocktakings
    app.get('/stocktakings', passport.authAdmin, stocktakings.all);
    app.post('/stocktakings/generate', passport.authAdmin, stocktakings.generate);
    app.get('/stocktakings/csv/:id', passport.authAdmin, stocktakings.csv);
    app.get('/stocktakings/html/:id', passport.authAdmin, stocktakings.html);
};