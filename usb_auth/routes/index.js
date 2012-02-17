var url = require('url');
var fs = require('fs');

/*
 * GET home page.
 */

exports.index = function(req, res){
  var urlString = url.parse(req.url, true).query;
  var logFile = fs.openSync('./log.txt', 'a+');
  if (urlString.action == 'login') {
    fs.writeSync(logFile, 'User logged in on device ' + urlString.device + ' with token ' + urlString.token + '\n', null);
  } else if (urlString.action == 'logout') {
    fs.writeSync(logFile, 'User logged out from device ' + urlString.device + '\n', null);
  }
  fs.close(logFile);
  res.render('index', { title: 'See log file for detailed info about the request.\n' })
};
