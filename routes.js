var index = require('./controllers/index');
var admin = require('./controllers/admin');
var users = require('./controllers/users');
var transactions = require('./controllers/transactions');
var products = require('./controllers/products');
var statuses = require('./controllers/statuses');
var paytypes = require('./controllers/paytypes');
var stocktakings = require('./controllers/stocktakings');

var passport = require('passport');

module.exports = function(app) {
    
    //Partials
    app.get('/admin/:page', admin.page);
    app.get('/dialog/:dialog', admin.dialog);

    //Pos view
    app.get('/', index.index);
    //Pos authenticated actions
    app.get('/posdata', index.posdata);
    app.post('/transaction', index.transaction);
    app.post('/transaction/invalid', index.invalid);

    //Admin view
    app.get('/admin', authAdmin, admin.index);

    //Admin authenticated actions

    //Users
    app.get('/users', users.all);
    app.post('/users/save', users.save);
    app.post('/users/remove', users.remove);

    //Transactions
    app.get('/transactions', transactions.all);

    //Products
    app.get('/products', products.all);
    app.post('/products/save', products.save);
    app.post('/products/remove', products.remove);

    //Statuses
    app.get('/statuses', statuses.all);
    app.post('/statuses/save', statuses.save);
    app.post('/statuses/remove', statuses.remove);

    //Paytypes
    app.get('/paytypes', paytypes.all);
    app.post('/paytypes/save', paytypes.save);
    app.post('/paytypes/remove', paytypes.remove);

    //Stocktakings
    app.get('/stocktakings', stocktakings.all);
    app.post('/stocktakings/generate', stocktakings.generate);
    app.get('/stocktakings/csv/:id', stocktakings.csv);
    app.get('/stocktakings/html/:id', stocktakings.html);
}}

var authAdmin = passport.authenticate('digest', {session: false});

var authPos = function(){}