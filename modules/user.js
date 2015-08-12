var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    server = require('../app');
/*
var userCollection = new User({
	first_name: "Mahidhara",
	last_name: "Suryateja",
	username: "surya@cue",
	password: '123456',
	email: "suryateja.mahidhara@cuelogic.co.in",
	role: "admin"
}); 

// save user to database
userCollection.save(function(err) {
    if (err) throw err;

	// fetch user and test password verification
	User.findOne({ username: 'surya@cue' }, function(err, user) {
	    if (err) throw err;

	    // test a matching password
	    user.comparePassword('123456', function(err, isMatch) {
	        if (err) throw err;
	        console.log('123456:', isMatch); // -&gt; 123456: true
	    });

	    // test a failing password
	    user.comparePassword('123456', function(err, isMatch) {
	        if (err) throw err;
	        console.log('123456:', isMatch); // -&gt; 123456: false
	    });
	});
}); */

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
	}
});