var server = require('./server.js');
var router = require('./router.js');
var requestHandlers = require("./requestHandlers.js");

var handle = {}
handle["/register"] = requestHandlers.register;
handle["/create"] = requestHandlers.create;
handle["/all_users"] = requestHandlers.all_users;
handle["/getall"] = requestHandlers.all_chirps;
handle["/get_chirps"] = requestHandlers.get_chirps;

server.start(router.route, handle);