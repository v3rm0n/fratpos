var index = require('./controllers/index');
var admin = require('./controllers/admin');
var users = require('./controllers/users');
var transactions = require('./controllers/transactions');
var products = require('./controllers/products');
var statuses = require('./controllers/statuses');
var paytypes = require('./controllers/paytypes');
var stocktakings = require('./controllers/stocktakings');

var passport = require('passport');
var nconf = require('./nconf');

module.exports = function(app) {

    //Pos view
    app.get('/', authPos, index.index);

    //Pos actions
    app.get('/posdata', authPos, index.posdata);
    app.post('/transaction', authPos, index.transaction);
    app.post('/transaction/invalid', authPos, index.invalid);

    //Admin view
    app.get('/admin', authAdmin, admin.index);

    //Partials
    app.get('/admin/:page', authAdmin, admin.page);
    app.get('/dialog/:dialog', authAdmin, admin.dialog);

    //Admin actions

    //Users
    app.get('/users', authAdmin, users.all);
    app.post('/users/save', authAdmin, users.save);
    app.post('/users/remove', authAdmin, users.remove);

    //Transactions
    app.get('/transactions', authAdmin, transactions.all);

    //Products
    app.get('/products', authAdmin, products.all);
    app.post('/products/save', authAdmin, products.save);
    app.post('/products/remove', authAdmin, products.remove);

    //Statuses
    app.get('/statuses', authAdmin, statuses.all);
    app.post('/statuses/save', authAdmin, statuses.save);
    app.post('/statuses/remove', authAdmin, statuses.remove);

    //Paytypes
    app.get('/paytypes', authAdmin, paytypes.all);
    app.post('/paytypes/save', authAdmin, paytypes.save);
    app.post('/paytypes/remove', authAdmin, paytypes.remove);

    //Stocktakings
    app.get('/stocktakings', authAdmin, stocktakings.all);
    app.post('/stocktakings/generate', authAdmin, stocktakings.generate);
    app.get('/stocktakings/csv/:id', authAdmin, stocktakings.csv);
    app.get('/stocktakings/html/:id', authAdmin, stocktakings.html);
}

var authAdmin = function(req, res, next){
    if(nconf.get('admin:authenticate'))
        passport.authenticate('admin', {session: false})(req,res,next);
    else
        next();
}

var authPos = function(req,res,next){
    if(nconf.get('posuser:authenticate'))
        passport.authenticate('pos', {session: false})(req,res,next);
    else
        next();
}