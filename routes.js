var index = require('./controllers/index');
var admin = require('./controllers/admin');
var users = require('./controllers/users');

module.exports = function(app) {
	app.get('/', index.index);
	app.get('/admin', admin.index);
	app.get('/users', users.index);
}