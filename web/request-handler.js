var path = require('path');
var archiveHelpers = require('../helpers/archive-helpers');
var fs = require('fs');
var Url = require('url');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var url = req.url;
  var method = req.method;
  if (req.url === '/') {
    fs.appendFile(archiveHelpers.paths.list, 'google' + '\n');

    res.writeHead(200, httpHelpers.headers); //add callback for setHeader
    fs.readFile(__dirname + '/public/index.html', function(err, data) {
      if (err) {
        // console.log('////////////////////', err);
      } else {
        // console.log('/////////////////////////////////', data);

        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/styles.css') {
    res.writeHead(200, httpHelpers.headers); //add callback for setHeader
    fs.readFile(__dirname + '/public/styles.css', function(err, data) {
      if (err) {
        //handle error
      } else {
        res.write(data);
        res.end();
      }
    });
  }
};