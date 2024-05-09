// Create web server

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var comments = require('./comments');
var url = require('url');

var server = http.createServer(function (req, res) {
  var urlData = url.parse(req.url, true);
  var pathname = urlData.pathname;
  var query = urlData.query;

  if (pathname === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', function (err, data) {
      if (err) {
        throw err;
      }
      res.end(data);
    });
  } else if (pathname === '/comments' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(comments));
  } else if (pathname === '/comments' && req.method === 'POST') {
    var str = '';
    req.on('data', function (data) {
      str += data;
    });
    req.on('end', function () {
      var comment = JSON.parse(str);
      comments.push(comment);
      res.end(JSON.stringify(comments));
    });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Not Found');
  }
});

server.listen(3000, function () {
  console.log('Server is running...');
});