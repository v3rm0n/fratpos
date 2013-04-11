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
    app.get('/dialog', admin.page);

    //Ajax requests

    //Pos actions
    app.get('/posdata', index.posdata);
    app.post('/transaction', index.transaction);
    app.post('/transaction/invalid', index.invalid);

    //Admin actions

    //Users
	app.get('/users', users.all);
    app.post('/users/add', users.add);
    app.post('/users/reset', users.reset);
    app.get('/users/change', users.change);
    app.post('/users/remove', users.remove);
    app.post('/users/balance', users.changeBalance);

    //Transactions
    app.get('/transactions', transactions.all);
    app.post('/transactions/reset', transactions.reset);

    //Products
    app.get('/products', products.all);
    app.post('/product/add', products.changeProduct);
    app.post('/product/change', products.changeProduct);
    app.post('/products/remove', products.removeProduct);

    //Statuses
    app.get('/statuses', statuses.all);
    app.post('/statuses/add', statuses.addStatus);
    app.post('/statuses/remove', statuses.removeStatus);

    //Paytypes
    app.get('/paytypes', paytypes.all);
    app.post('/paytypes/add', paytypes.addPaytype);
    app.post('/paytypes/remove', paytypes.removePaytype);
}