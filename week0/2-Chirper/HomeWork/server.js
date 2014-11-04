var http = require('http');
var url = require('url');

// var querystring = require("querystring");

function start(route, handle) {
	http.createServer(function(request, response) {
		var urlParsed = url.parse(request.url);
		//console.log(response);
console.log('request.url', request.url);
console.log('url.parse(request.url).pathname', url.parse(request.url).pathname);
console.log('url.parse(request.url).query', url.parse(request.url).query);
console.log('request.method', request.method);
		// console.log('url.parse(request.url).pathname', url.parse(request.url).pathname);
		// console.log('url.parse(request.url).query', url.parse(request.url).query); ///start?foo=bar&hello=world
		var postData = "";
		var pathname = urlParsed.pathname;

		if (urlParsed.hasOwnProperty('query')) {
			var queryString = urlParsed.query;
		};
		
		request.on('data', function(chunk){
			postData += chunk;
		});
		request.on('end', function(chunk){
			route(handle, response, postData, pathname, queryString);
		});
	}).listen(8080);
	console.log('srv started');
}

module.exports.start = start;