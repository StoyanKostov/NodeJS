// The script should import in database-name, 
// in the collection people the data from people.json

// The collection, in which the data is going to is determined 
// by the name of the JSON file we are importing

var MongoClient = require('mongodb').MongoClient
	, assert = require('assert')
	, fs = require('fs')
	, path = require('path')
	, url = require('./config.json')
	, data = require('./people.json')
	, inputFile = process.argv[2];

function jsonToMongoDB(inputFile, callBack){
	fs.readFile(inputFile, function(error, data) {
		if (error) {
			console.error('Error reading file: ' + error);
		} else {
			var collectionName = path.basename(inputFile,'.json');
			callBack(collectionName, url.mongoConnectionUrl, data);
		}
	});
}

jsonToMongoDB(inputFile, function(collectionName, url, data){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
		db.collection(collectionName).insertMany(JSON.parse(data), function(err, result){
			assert.equal(null, err);
			assert.equal(JSON.parse(data).length, result.result.n);
    		assert.equal(JSON.parse(data).length, result.ops.length);
			//console.log(err);
			console.log(result);
			db.close();
		});
	});
});

// Use connect method to connect to the Server
// http://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
// fs.readFile(inputFile, function(error, data) {
// 	if (error) {
// 		console.error('Error reading file: ' + error);
// 	} else {
// 		// Write to file
// 		writeJsonToFile(outPutfileName, jsonBuilder(data));
// 	}
// });

// MongoClient.connect(url.mongoConnectionUrl, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");

//   db.close();
// });