var querystring = require("querystring");

function register(response, postData) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	//response.write('sdfdsf register');
	postData = JSON.parse(postData);
	postData.foo = 'return from server';
	console.dir(postData);
	response.write(JSON.stringify(postData));
	response.end();
}
function start(response, postData) {
	var body = '<html>'+
				'<head>'+
					'<meta http-equiv="Content-Type" content="text/html; '+
					'charset=UTF-8" />'+
				'</head>'+
				'<body>'+
					'<form action="/upload" method="post">'+
						'<input type="text" name="name" />'+
						'<textarea name="text" rows="20" cols="60"></textarea>'+
						'<input type="submit" value="Submit text" />'+
					'</form>'+
				'</body>'+
				'</html>';


	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}
function upload(response, postData) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(querystring.parse(postData).name);
	response.write(querystring.parse(postData).text);
	//response.write(postData.toString());
	response.end();
}
module.exports.register = register;
module.exports.start = start;
module.exports.upload = upload;