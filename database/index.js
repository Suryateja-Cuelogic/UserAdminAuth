var mongoose = require('mongoose');

// Connect mongoDB with mongoose.
mongoose.connect("mongodb://localhost/UserAdminauth");
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function () {
	console.log("Connection to mongoDB is successful");
});