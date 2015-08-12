// Integrate HAPI and Mongoose Module.
var hapi = require('hapi');

// Create a server object, Establish a server connection.
var server = module.exports = new hapi.Server();

server.connection({ port:2001 });

require('./database');

require('./modules/user');

// Start the server.
server.start(function () {
	console.log("Server running at: ", server.info.uri );
});