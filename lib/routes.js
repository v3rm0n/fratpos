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
    feedbacks = require('../controllers/feedbacks'),
    auth = require('./auth');

module.exports = function (app) {
    //Pos view
    app.get('/', auth.pos, index.index);

    //Pos actions
    app.get('/posdata', auth.pos, index.posdata);
    app.post('/transaction', auth.pos, index.transaction);
    app.post('/transaction/invalid', auth.pos, index.invalid);

    app.post('/feedback', auth.pos, index.feedback);
    app.get('/dialog/feedback', auth.pos, index.feedbackDialog);

    //Admin view
    app.get('/admin', auth.admin, admin.index);

    //Partials
    app.get('/admin/:page', auth.admin, admin.page);
    app.get('/dialog/:dialog', auth.admin, admin.dialog);

    //Admin actions

    //Users
    app.get('/users', auth.admin, users.all);
    app.post('/users/save', auth.admin, users.save);
    app.post('/users/remove', auth.admin, users.remove);

    //Transactions
    app.get('/transactions', auth.admin, transactions.all);
    app.post('/transaction/invalid/admin', auth.admin, index.invalidAdmin);

    //Products
    app.get('/products', auth.admin, products.all);
    app.post('/products/save', auth.admin, products.save);
    app.post('/products/remove', auth.admin, products.remove);

    //Statuses
    app.get('/statuses', auth.admin, statuses.all);
    app.post('/statuses/save', auth.admin, statuses.save);
    app.post('/statuses/remove', auth.admin, statuses.remove);

    //Paytypes
    app.get('/paytypes', auth.admin, paytypes.all);
    app.post('/paytypes/save', auth.admin, paytypes.save);
    app.post('/paytypes/remove', auth.admin, paytypes.remove);

    //Stocktakings
    app.get('/stocktakings', auth.admin, stocktakings.all);
    app.post('/stocktakings/generate', auth.admin, stocktakings.generate);
    app.get('/stocktakings/csv/:id', auth.admin, stocktakings.csv);
    app.get('/stocktakings/html/:id', auth.admin, stocktakings.html);

    //Feedback
    app.get('/feedbacks', auth.admin, feedbacks.all);
    app.post('/feedbacks/remove', auth.admin, feedbacks.remove);
};