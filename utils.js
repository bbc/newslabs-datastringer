var h = require('http');
var fs = require('fs');

function getTheJSON(opt, callback) {
  var json = String();

  var req = h.request(opt, function(response) {
    response.on('data', function(data) {json += data;});
    response.on('end', function() {
      callback(undefined, json);
    });
  }).on('error', function(err){
    callback(err, json);
  });

  req.end();
}

var assetsRootFolder = process.env.HOME + '/.local/share/datastringer/';

function createDirsIfNeeded(fullPath) {
  var tokenizedPath = fullPath.split('/');
  tokenizedPath.pop(); // last element is the filename.

  var currPath = '';
  while (tokenizedPath.length) {
    currPath += tokenizedPath.shift() + '/';

    if (!fs.existsSync(currPath)) {
      fs.mkdirSync(currPath);
    }
  }
}

// read the asset named assetFileName and return its content thru the
// callback. Assumes the asset contains text.
// callback signature: (err, assetContent)
function readAsset(assetFileName, callback) {
  var fullPath = assetsRootFolder + assetFileName;

  fs.readFile(fullPath, 'utf8', callback);
}

// write content to the asset named assetFileName. Will be overwritten if
// already existing. If error occurs, the callback is called with the error.
// Otherwise, when done the callback is called without any parameter.
// callback signature: (err)
function writeAsset(assetFileName, assetContent, callback) {
  var fullPath = assetsRootFolder + assetFileName;
  createDirsIfNeeded(fullPath);

  fs.writeFile(fullPath, assetContent, 'utf8', callback);
}

module.exports = {
  getTheJSON: getTheJSON,
  readAsset: readAsset,
  writeAsset: writeAsset
};
