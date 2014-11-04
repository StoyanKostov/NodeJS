var http = require('http'),
pandaCounter = 0;
http.createServer(function (req, res) {
	var payload = "";
	console.log(req.url);
	console.log(req.method);
	req.on('data', function(chunk) {
		console.log("Received body data:");
		console.log(chunk.toString());
		payload += chunk.toString();
	});
	req.on('end', function() {
		pandaCounter ++;
		res.writeHead(200, "OK", {'Content-Type': 'text/html'});
		res.end("PANDATIGAN " + pandaCounter);
	});
}).listen(8080);

// Object.keys(obj);
// o.hasOwnProperty('prop')
// Object.getOwnPropertyNames(window)
var chirpDB = {
	'Archeo' : {
		'key' : '',
		'chirps' : [
			{'chirpId' : ''},
			{'chirpText' : ''},
			{'chirpTime' : ''},
		]
	}
}

chirpDB.hasOwnProperty('Archeo');
Object.keys(chirpDB);
Object.getOwnPropertyNames(chirpDB);

/*za id lo-dash*/
// http://www.learnallthenodes.com/episodes/3-beginning-routing-in-nodejs
//http://pixelhandler.com/posts/develop-a-restful-api-using-nodejs-with-express-and-mongoose
// module.exports

// Rado router
//https://gist.github.com/RadoRado/affde79b108b0b909a5e

//http://www.nodebeginner.org/#the-use-cases
// http://www.sitepoint.com/making-http-requests-in-node-js/