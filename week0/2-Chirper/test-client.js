var http = require("http");
var ArgumentParser = require('argparse').ArgumentParser;
var url = require('url');

var configJson = {
  "api_url": "http://localhost:8080",
  "user": "Archeo",
  "key": "puk"
}

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse examples: sub-commands'
});
var subparsers = parser.addSubparsers({
  title: 'commands',
  dest: 'act'
});
//*Registering user
subparsers.addParser('register') // POST /register -> expects user as argument. Creates a new user and returns a key for that user. If the user already exists just returns a 409 response code.
  .addArgument(
    [ '--user' ]
  );
//*Get all the registered users
subparsers.addParser('all_users') // GET /all_users
//*Get all chirps 
subparsers.addParser('getall') // GET /all_chirps ->  returns all the chirps for all the users we have. Newest chirps should be first.
//Get my chirps
subparsers.addParser('getself') // GET /my_chirps -> expects user and key as arguments. Returns all chirps of user
//*Create new chirp
subparsers.addParser('create') // POST /chirp -> expects user, key and chirpText arguments. Creates a new chirp on behalf of user and returns a chirpId, which should be unique for every chirp!
  .addArgument(
    [ '--message' ]
  );
//Delete a chirp
subparsers.addParser('delete') // DELETE /chirp ->  expects key and chirpId as arguments. Deletes the chirp with the given id if the key matches the key of the chirp owner. Otherwise returns a 403 response code.
  .addArgument(
    [ '--chirpid' ]
  );
//Get chirps
subparsers.addParser('get_chirps') // GET /chirps ->  expects either chirpId or userId as an argument. If given both ignores chirpId. Returns a list of chirps.
  .addArgument(
    [ '--chirpid' ]
  );

var args = parser.parseArgs();

var postData = args;

// GET requests
var url;
url.protocol = 'http';
url.host = 'localhost:8080';
url.pathname = args.act;
//url.pathname?url.query
if (args.hasOwnProperty('chirpid')) {
  url.search = Object.keys(args)[1] + "=" +args.chirpid; // foo=bar&hello=world
};

console.log(url.format(url));
if (args.act == 'all_users' || args.act == 'get_chirps') {
  http.get(url.format(url), function(res) {
    res.on("data", function(data) {
      console.log(data.toString());
    });
  });
};

// POST requests
if (args.act == 'register' || args.act == 'create') {
  if (args.act == 'create') {
    postData.user = configJson.user;
    postData.key = configJson.key;
  };
  
  postData = JSON.stringify(postData);
  console.log(postData);
  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  };

  var options = {
    host: 'localhost',
    port: 8080,
    path: '/' + args.act,
    method: 'POST',
    headers: headers
  };

  var req = http.request(options, function(res) {
  	res.setEncoding('utf-8');

  	var responseString = '';

  	res.on('data', function(data) {
  		responseString += data;
  	});

  	res.on('end', function() {
  		console.log(responseString);
  		//console.dir(JSON.parse(responseString));
  	});
  });

  req.write(postData);
  req.end();
};