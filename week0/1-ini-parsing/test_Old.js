var input = process.argv[2]

// http://blog.modulus.io/nodejs-scripts
var http = require('http');
/*http.get('http://some.awesome.place.com/interesting_thin.gz', function(res) {
	res.on('data', function(data) {
	  console.log(data.toString())
	});
});*/

var fs = require('fs');
fs.readFile('config.ini', function(error, data) {
  if (error) {
	console.error('Error reading file: ' + error);
  } else {
	var jsonObj = jsonBuilder(data);
	// http://tecfa.unige.ch/guides/js/ex-intro/angus_strings.html
	// get file name
	var fileName = __filename.replace(__dirname + "\\", "");
	fileName = fileName.substring(0, fileName.indexOf('.'));


	//console.log(fileName);
	console.log('--------------------');
	//console.log(fileName);
	//console.log(jsonObj);

	// Write to file
	writeJsonToFile('message.txt', jsonObj)
  }
});

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

	//console.log(responseData);
	//Build Json from prepared string data
	var lastPrimeKey;
	responseData.forEach(function(val, i){
		if (val.indexOf(":") == -1) {
			lastPrimeKey = val;
			resultJson[lastPrimeKey] = {};
			//console.log(lastPrimeKey);
			//resultJson[lastPrimeKey][dummKey] = '2'
		}else{
			//val = JSON.parse(val)
			//console.log(val)
			resultJson[lastPrimeKey] = JSON.parse(val);
			//resultJson[lastPrimeKey] = {};
			//resultJson[lastPrimeKey] = val;
		};
		//console.log(i, val);
	});

	//console.log(resultJson);
	return resultJson;
}