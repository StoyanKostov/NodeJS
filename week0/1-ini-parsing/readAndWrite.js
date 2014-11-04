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
					// Remove '[', ']' of section
					.replace(/\[([A-Za-z0-9]{1,})\]/g, function(a, b, c){ 
						return b;
					})
					// Replace new lines with ",".  str.split(/(\r\n|\n|\r)/) did NOT work
					.replace(/(\r\n|\n|\r|\n\r)/g, ',')
					// Build Array
					.split(/,/);

	// Remove empty index if any
	responseData = responseData.filter(function(el){
		return el;
	});

	// Remove last index if empty
	// if (responseData[responseData.length] != "") {
	// 	responseData.pop();
	// };

	// //Build Json from prepared string data
	var lastPrimeKey;
	responseData.forEach(function(val, i){
		var currIndexOfEquals = val.indexOf("=");
		if (currIndexOfEquals == -1) {
			lastPrimeKey = val;
			resultJson[lastPrimeKey] = {};
		}else{
			var currSubKey = val.substring(0, currIndexOfEquals).trim();
			var currSubValue = val.substring(currIndexOfEquals+1).trim();
			if (currSubValue != "") {
				resultJson[lastPrimeKey][currSubKey] = currSubValue;
			};
		};
	});
	console.dir(resultJson);
	return resultJson;
}
