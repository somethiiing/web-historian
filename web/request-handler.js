var path = require('path');
var archiveHelpers = require('../helpers/archive-helpers');
var fs = require('fs');
var urlParser = require('url');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

var actions = {
  'GET': function(request, response) {
    var urlPath = url.parse(request.url).pathname;

    if (urlPath === '/') {
      urlPath = '/index.html';
    }
    helpers.serveAssets(response, urlPath, function() {
      if (urlPath[0] === '/') {
        urlPath = urlPath.slice(1);
      }

      archive.isUrlInList(urlPath, function(found) {
        if (found) {
          helpers.sendRedirect(response, '/loading.html');
        } else {
          helpers.send404(response);
        }
      });
    });
  }
  // ,
  // 'POST': function() {

  // }

};

exports.handleRequest = function (request, response) {
  var url = request.url;
  var method = request.method;
  if (request.url === '/') {
    fs.appendFile(archiveHelpers.paths.list, 'google' + '\n');

    response.writeHead(200, httpHelpers.headers); //add callback for setHeader
    fs.readFile(__dirname + '/public/index.html', function(err, data) {
      if (err) {
        // console.log('////////////////////', err);
      } else {
        // console.log('/////////////////////////////////', data);

        response.write(data);
        response.end();
      }
    });
  } else if (request.url === '/styles.css') {
    response.writeHead(200, httpHelpers.headers); //add callback for setHeader
    fs.readFile(__dirname + '/public/styles.css', function(err, data) {
      if (err) {
        //handle error
      } else {
        response.write(data);
        response.end();
      }
    });
  }
};