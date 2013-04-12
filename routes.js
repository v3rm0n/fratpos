var index = require('./controllers/index');
var admin = require('./controllers/admin');
var users = require('./controllers/users');
var transactions = require('./controllers/transactions');
var products = require('./controllers/products');
var statuses = require('./controllers/statuses');
var paytypes = require('./controllers/paytypes');

module.exports = function(app) {
    //Main views
    app.get('/', index.index);
    app.get('/admin', admin.index);
    //Partials
    app.get('/admin/:page', admin.page);
    app.get('/dialog/:dialog', admin.dialog);

    //Ajax requests

    //Pos actions
    app.get('/posdata', index.posdata);
    app.post('/transaction', index.transaction);
    app.post('/transaction/invalid', index.invalid);

    //Admin actions

    //Users
    app.get('/users', users.all);
    app.post('/users/save', users.save);
    app.post('/users/reset', users.reset);
    app.post('/users/remove', users.remove);

    //Transactions
    app.get('/transactions', transactions.all);
    app.post('/transactions/reset', transactions.reset);

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
}