var http = require('http');
var url = require('url');
var fs = require('fs');

var app = http.createServer(function (request, response) {
	response.writeHead(200, {'Content-Type': 'text/plain'});

	var urlString = url.parse(request.url, true).query;
	var logFile = fs.openSync('./log.txt', 'a+');
	if (urlString.action == 'login') {
		fs.writeSync(logFile, 'User logged in on device ' + urlString.device + ' with token ' + urlString.token + '\n', null);
	} else if (urlString.action == 'logout') {
		fs.writeSync(logFile, 'User logged out from device ' + urlString.device + '\n', null);
	}
	fs.close(logFile);

	response.end('See log file for detailed info about the request.\n');
}).listen(8000);

console.log('Server running at http://127.0.0.1:8000/');
