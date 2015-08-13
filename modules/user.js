var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    server = require('../app'),
    joi = require('joi'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    Boom = require('boom');


var privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc'; // Private key

// Validate function to be injected 
var validate = function(token, callback) {
	console.log("I am here");
    callback(null, true, token);
};

// Plugins, register hapi-auth-jwt to server
server.register([{
    register: require('hapi-auth-jwt')
}], function(err) {
    server.auth.strategy('token', 'jwt', {
        validateFunc: validate,
        key: privateKey
    });

	// Now improve a login route

	server.route({
		method: 'POST',
		path: '/login',
		config: {
			validate: {
				payload: {
					username: joi.string().required(),
					password: joi.string().min(3).max(10).required()
				}			
			}
		},
		handler: function (request,reply) {
			
			User.findOne({'username':request.payload.username}, function (err,user) {
				if( !err && user ) {
					user.comparePassword(request.payload.password, function(err, isMatch) {
				        if ( !err && isMatch) {
				        	var tokenData = {
		                        username: user.username,
		                        scope: user.role,
		                        id: user._id
		                    };
		                    var res = {
		                        username: user.username,
		                        email: user.email,
		                        scope: user.role,
		                        token: jwt.sign(tokenData, privateKey)
		                    };

                    		reply(res);
				        } else if ( !err ) {
				        	reply(Boom.forbidden("invalid username or password"));
				        } else {
				        	reply(err);
				        }
				    });
				} else if ( !err ) {
					reply(Boom.forbidden("invalid username or password"));
				} else {
					reply(err);
				}
			});
		}
	});

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
					password: joi.string().min(3).max(10).required(),
					email: joi.string().email().required(),
					role: joi.string().required()
				}
			},
			auth: {
				strategy: 'token',
				scope: ['admin']
			}
		}
	});

	// Bulid Get route to pull all user details

	server.route({
		method: 'GET',
		path: '/users',
		handler: function (request, reply) {
			console.log(request);

			User.find({}, function (err,users) {
				if (err) {
					reply(err);
				} else {
					reply(users);
				}
			});
		},
		config: {
			auth: {
				strategy: 'token',
				scope: ['admin']
			}
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
			},
			auth: {
				strategy: 'token',
				scope: ['admin','user']
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
					last_name: joi.string(),
					username: joi.string().alphanum().min(3).max(10).required(),
					password: joi.string().min(3).max(10).required(),
					email: joi.string().email().required(),
					role: joi.string().required()
				},
				params: {
					id: joi.string().alphanum()
				}
			},
			auth: {
				strategy: 'token',
				scope: ['admin']
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
			},
			auth: {
				strategy: 'token',
				scope: ['admin']
			}
		}
	});

});