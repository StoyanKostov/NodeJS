var querystring = require("querystring");
var _ = require('argparse/node_modules/underscore/underscore.js');
// console.log(_.shuffle(chirpIdChars));

//http://docs.mongodb.org/manual/reference/bios-example-collection/
var chirpDB = {};

var myDate = new Date();
chirpDB.Archeo = {
	'key' : 'puk',
	'chirps' : [
		{
		'chirpId' : 'fgg',
 		'chirpText' : 'Something in the way',
 		'chirpTime' : 3,
 		},

	]
}

chirpDB.Rinsuint = {
	'key' : 'foo',
	'chirps' : [
		{
		'chirpId' : 'Utg',
 		'chirpText' : 'Some Text',
 		'chirpTime' : 1,
 		},
		{
		'chirpId' : 'ggg',
 		'chirpText' : 'Some other Text',
 		'chirpTime' : 7,
 		},
	]
}

// 'Archeo' : {
// 	'key' : '',
// 	'chirps' : [
// 		{'chirpId' : ''},
// 		{'chirpText' : ''},
// 		{'chirpTime' : ''},
// 	]
// }
//POST /register
function register(response, postData) {
	var user = JSON.parse(postData).user;
	if (!chirpDB.hasOwnProperty(user)) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		chirpDB[user] = {};
		chirpDB[user].key = generateUniqeKey();
		chirpDB[user].chirps = [];
console.dir(chirpDB);
		response.write(chirpDB[user].key);
		response.end();
	}
	else{
		response.writeHead(409, {"Content-Type": "text/plain"});
		response.write('Such user already exists');
		response.end();
	};
}
//POST /chirp
function create(response, postData) {
	postData = JSON.parse(postData);
	var currChirpsIndex = {};
	var chirpId = generateUniqeKey();
	var user = postData.user;
	var key = postData.key;
	if (chirpDB.hasOwnProperty(user)) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		currChirpsIndex.chirpId = chirpId;
		currChirpsIndex.chirpText = postData.message;
		currChirpsIndex.chirpTime = new Date();
		chirpDB[user].chirps.unshift(JSON.stringify(currChirpsIndex));
		response.write(chirpId);
		response.end();
	}
	else{
		response.writeHead(409, {"Content-Type": "text/plain"});
		response.write('Such user does NOT exist');
		response.end();
	};
}
//GET requests
function get_chirps(response, postData, queryString) {
	// var responseData = [];
	// for(user in chirpDB){
	// 	for(var i = 0; i < chirpDB[user].chirps.length; i++){
	// 		var currEntry = chirpDB[user].chirps[i];
	// 		currEntry.userId = user;
	// 		responseData.unshift(chirpDB[user].chirps[i]);
	// 	}
	// };
	//responseData.sort(function(a,b){return b.chirpTime - a.chirpTime});
	//response.writeHead(200, {"Content-Type": "text/plain"});
	console.dir(querystring.parse(queryString));
	//response.write(JSON.stringify(responseData));
	//response.end();
}
function all_chirps(response, postData) {
	var responseData = [];
	for(user in chirpDB){
		for(var i = 0; i < chirpDB[user].chirps.length; i++){
			var currEntry = chirpDB[user].chirps[i];
			currEntry.userId = user;
			responseData.unshift(chirpDB[user].chirps[i]);
		}
	};
	responseData.sort(function(a,b){return b.chirpTime - a.chirpTime});
	response.writeHead(200, {"Content-Type": "text/plain"});
	//console.dir(responseData);
	response.write(JSON.stringify(responseData));
	response.end();
}
function all_users(response, postData) {
	var responseData = [];

	for(user in chirpDB){
		responseData.unshift({
			"user" : user,
			"userId" : chirpDB[user].key,
			"chirps" : chirpDB[user].chirps.length,
		});
	};

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(JSON.stringify(responseData));
console.dir(responseData);
	response.end();
}
// Helper functions

// act:register || act:create
function writeToChirpDB( act, userName, chirpText){
	if (!chirpDB.hasOwnProperty(userName) && act == 'register') {
		var currChirpsIndex = {};
		chirpDB[userName] = {};
		chirpDB[userName].chirps = [];
		currChirpsIndex.userId = generateUniqeKey();

		if (chirpText != undefiend) {
			currChirpsIndex.chirpId = generateUniqeKey();
			currChirpsIndex.chirpText = chirpText;
			currChirpsIndex.chirpTime = new Date();
			chirpDB[userName].chirps.unshift(currChirpsIndex);
		};
	}
	else{
		return 409;
	};
}

function getFromChirpDB( userName, userId, chirpId, chirpText, chirpTime){
	var currChirpsIndex = {};
	chirpDB[userName] = {};
	chirpDB[userName].chirps = [];
	currChirpsIndex.userId = generateUniqeKey();
	currChirpsIndex.chirpId = generateUniqeKey();
	currChirpsIndex.chirpText = chirpText;
	currChirpsIndex.chirpTime = chirpTime;
	chirpDB[userName].chirps.unshift(currChirpsIndex);
}

function generateUniqeKey(){
	var  chirpIdChars = [];
	for (var i = 0; i < 26; i++) {
		chirpIdChars[i] = String.fromCharCode(i + 65);
		chirpIdChars[i+26] = String.fromCharCode(i + 97);
	};
	return (_.shuffle(chirpIdChars).slice(0, 3)).join('');
}

module.exports.register = register;
module.exports.create = create;
module.exports.all_users = all_users;
module.exports.all_chirps = all_chirps;
module.exports.get_chirps = get_chirps;