function route(handle, response, postData, pathname, queryString) {
	//console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, postData, queryString);
	} else {
		console.log("No request handler found for " + pathname);
	}
}
module.exports.route = route;