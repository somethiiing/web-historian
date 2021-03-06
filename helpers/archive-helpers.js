var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log('You have an error: ' + err);
    } else {
      data = data.split('\n');
      callback(data);
    }
  });

};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function (err, data) {
    if (err) {
      callback(err);
    } else {
      var ans = false;
      var allUrls = data.split('\n');
      for (var i = 0; i < allUrls.length; i++) {
        if (url === allUrls[i]) {
          ans = true;
        }
      }
      callback(err, ans);
    }
  }); 
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  var sitePath = path.join(exports.paths.archivedSites, url);

  fs.exists(sitePath, function(exists) {
    callback(exists);
  });

};

exports.downloadUrls = function(urls) {
  _.each (urls, function (url) {
    if (!url) {
      return;
    } 
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};





























