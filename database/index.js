var mongoose = require('mongoose');

require('./models/user');

// Connect mongoDB with mongoose.
mongoose.connect("mongodb://localhost/UserAdminAuth");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
	console.log("Connection to mongoDB is successful");
});