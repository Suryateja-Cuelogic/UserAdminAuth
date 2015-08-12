var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    server = require('../app'),
    joi = require('joi');

// Build post route to add new users

server.route({
	method: 'POST',
	path: '/add',
	handler: function (request,reply) {

		var user = new User(request.payload);

		user.save( function (err, user) {
			if (err) {
				reply(err);
			} else {
				reply(user);
			}
		});
	},
	config: {
		validate: {
			payload: {
				first_name: joi.string().min(3).max(15).required(),
				last_name: joi.string(),
				username: joi.string().alphanum().min(3).max(10).required(),
				password: joi.string().min(3).max(10),
				email: joi.string().email(),
				role: joi.string()
			}
		}
	}
});

// Bulid Get route to pull all user details

server.route({
	method: 'GET',
	path: '/users',
	handler: function (request, reply) {

		User.find({}, function (err,users) {
			if (err) {
				reply(err);
			} else {
				reply(users);
			}
		});
	}
});

// Build Get route to pull single user details

server.route({
	method: 'Get',
	path: '/user/{id}',
	handler: function (request,reply) {

		User.findOne({'_id':encodeURIComponent(request.params.id)},
			function (err,user) {
				if (!err && user) {
					reply(user);
				} else if (!err) {
					reply ({
						message: 'User Not Found'
					});
				} else {
					reply (error);
				}
			});
	},
	config: {
		validate: {
			params: {
				id: joi.string().alphanum()
			}
		}
	}
});

// Build Put route to update the user details

server.route({
	method: 'PUT',
	path: '/update/{id}',
	handler: function (request,reply) {

		User.findOne({'_id':encodeURIComponent(request.params.id)},
			function (err,user) {
				if (!err && user) {
					user.first_name = request.payload.first_name;
					user.last_name = request.payload.last_name;
					user.username = request.payload.username;
					user.password = request.payload.password;
					user.email = request.payload.email;
					user.role = request.payload.role; 
					user.save( function (err,user) {
						if (err) {
							reply(err);
						} else {
							reply(user);
						}
					});	
				} else if (!err) {
					reply ({
						message: 'User Not Found'
					});
				} else {
					reply (error);
				}
			});
	},
	config: {
		validate: {
			payload: {
				first_name: joi.string().min(3).max(15).required(),
				last_name: joi.string().min(3).max(15),
				username: joi.string().alphanum().min(3).max(10).required(),
				password: joi.string().min(3).max(10),
				email: joi.string().email(),
				role: joi.string()
			},
			params: {
				id: joi.string().alphanum()
			}
		}
	}
});

// Build Delete Route to delete the user details

server.route({
	method: 'DELETE',
	path: '/remove/{id}',
	handler: function (request,reply) {
		User.findOne({'_id':encodeURIComponent(request.params.id)},
			function (err,user) {
				if (!err && user) {
						if (err) {
							reply(err);
						} else {
							user.remove();
							reply({
								message: "User removed"
							});
						}
				} else if (!err) {
					reply ({
						message: 'User Not Found'
					});
				} else {
					reply (error);
				}
			});
	},
	config: {
		validate: {
			params: {
				id: joi.string().alphanum()
			}
		}
	}
});