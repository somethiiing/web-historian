var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var helpers = require('./http-helpers');

var actions = {
  'GET': function(req, res) {
    var urlPath = url.parse(req.url).pathname;

    if (urlPath === '/') { urlPath = '/index.html'; }

    helpers.serveAssets(res, urlPath, function() {
      if (urlPath[0] === '/') { urlPath = urlPath.slice(1); }

      archive.isUrlInList(urlPath, function(found) {
        if (found) {
          helpers.sendRedirect(res, '/loading.html');
        } else {
          helpers.send404(res);
        }
      });
    });
  },
  'POST': function(req, res) {
    helpers.collectData(req, function(data) {
      var url = data.split('=')[1].replace('http://', '');
      archive.isUrlInList(url, function(found) {
        if (found) { 
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              helpers.sendRedirect(res, '/' + url);
            } else {
              helpers.sendRedirect(res, '/loading.html');
            }
          });
        } else { 
          archive.addUrlToList(url, function() {
            helpers.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};

exports.handleRequest = function (req, res) {
  var handler = actions[req.method];
  if (handler) {
    handler(req, res);
  } else {
    helpers.send404(res);
  }
};