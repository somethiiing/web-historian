var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');

exports.headers = headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'text/html'
};

exports.sendRedirect = function(res, loc, status) {
  status = status || 302;
  res.writeHead(status, {loc: loc});
  res.end();
};

exports.sendResponse = function(res, obj, status) {
  status = status || 200;
  res.writeHead(status, headers);
  res.end(obj);
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};

exports.send404 = function(res) {
  exports.sendResponse(res, '404: Page not found', 404);
};

var readFile = Promise.promisify(fs.readFile);

exports.serveAssets = function(res, data, callback) {
  var encoding = {encoding: 'utf8'};
  return readFile(archive.paths.siteAssets + data, encoding)
    .then(function(contents) {
      contents && exports.sendResponse(res, contents);
    })
    .catch(function(err) {
      return readFile(archive.paths.archivedSites + data, encoding);
    })
    .then(function(contents) {
      contents && exports.sendResponse(res, contents);
    })
    .catch(function(err) {

      if (callback) {
        callback();
      } else {
        exports.send404(res);
      }
    });
};