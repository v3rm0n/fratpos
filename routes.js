var index = require('./controllers/index');
var admin = require('./controllers/admin');
var users = require('./controllers/users');

module.exports = function(app) {
    //Main views
	app.get('/', index.index);
	app.get('/admin', admin.index);
    //Ajax requests
	app.get('/users', users.index);
    app.post('/users', users.add);
    app.post('/users/remove', users.remove);
    app.post('/users/balance', users.balance);

    app.post('/warehouse', admin.warehouse);
    app.post('/warehouse/remove', admin.removeProduct);

    app.post('/transaction', index.transaction);
}