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
    app.post('/users/reset', users.reset);
    app.get('/users/change', users.change);
    app.post('/users/remove', users.remove);
    app.post('/users/balance', users.changeBalance);

    app.post('/warehouse', admin.changeProduct);
    app.post('/warehouse/remove', admin.removeProduct);

    app.post('/transaction', index.transaction);
    app.post('/transaction/invalid', index.invalid);
    app.post('/transaction/reset', admin.reset);

    app.post('/status', admin.addStatus);
    app.post('/status/remove', admin.removeStatus);
}