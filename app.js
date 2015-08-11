// Integrate HAPI and Mongoose Module.
var hapi = require('hapi');

// Create a server object, Establish a server connection.
var server = new hapi.Server();

server.connection({ port:2001 });

require('./database');

// Start the server.
server.start(function () {
	console.log("Server running at: ", server.info.uri );
});