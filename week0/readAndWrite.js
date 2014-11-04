var fs = require('fs');
var http = require('http');

var inputResourseName = process.argv[2];
var httpFlag = /^http/.test(inputResourseName);
var outPutfileName = inputResourseName.replace(/.ini/,".json");

//https://www.skostov.com/hackbulgaria/config.ini
//http://www.skostov.com/hackbulgaria/config.ini

if (httpFlag) {
	//console.log('httpFlag == true');
	http.get(inputResourseName, function(res) {
		res.on('data', function(data) {

			outPutfileName = outPutfileName.substring(outPutfileName.lastIndexOf("/") + 1);

			//Write to file
			writeJsonToFile(outPutfileName, jsonBuilder(data));
		});
	});
}else{
	fs.readFile(inputResourseName, function(error, data) {
	  if (error) {
		console.error('Error reading file: ' + error);
	  } else {

		// Write to file
		writeJsonToFile(outPutfileName, jsonBuilder(data));
	  }
	});
};


/*Help functions*/
function writeJsonToFile(fileName, jsonObj){
	fs.writeFile(fileName, JSON.stringify(jsonObj), function (error) {
	  if (error) throw err;
	  console.log('It\'s saved!');
	});
};

function jsonBuilder(data){
	var resultJson ={};
	var responseData;

	// Prepare string data
	responseData = data.toString()
					.trim()
					// remove comments (start ';', everything in between (.*), ends with new line (\r\n|\n|\r) )
	 				.replace(/^;(.*)/gm,"")
					// remove blanck lines
					.replace(/^\s*/gm,"")
					// Remove '[', ']' 
					.replace(/\[([A-Za-z0-9]{1,})\]/g, function(a, b, c){ 
						return b;
					})
					.replace(/=/g,':')
					.replace(/.*:.*/g, function(a, b, c){ 
						return "{"+ a  +"}";
					})
					.replace(/\{(.*):/g,function(a, b, c){ 
						return '{"' + b + '":';
					})
					.replace(/:(.*)\}/g,function(a, b, c){ 
						return ':"' + b + '"}';
					})
					// Replace new lines with ",".  str.split(/(\r\n|\n|\r)/) did NOT work
					.replace(/(\r\n|\n|\r)/g, ',')
					// Build Array
					.split(/,/);

	// Remove last empty index
	responseData.pop();

	//Build Json from prepared string data
	var lastPrimeKey;
	responseData.forEach(function(val, i){
		if (val.indexOf(":") == -1) {
			lastPrimeKey = val;
			resultJson[lastPrimeKey] = {};
		}else{
			resultJson[lastPrimeKey] = JSON.parse(val);
		};
	});
	return resultJson;
}