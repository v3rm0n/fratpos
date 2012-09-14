//Kasutajad
exports.index = function(req,res){
	var users = require('../models/users');
	users.getAll(res);
}