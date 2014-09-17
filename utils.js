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


function fullPath(assetFileName) {
  return assetsRootFolder + assetFileName;
}

// read the asset named assetFileName and return its content thru the
// callback. Assumes the asset contains text.
// callback signature: (err, assetContent)
function readAsset(assetFileName, callback) {
  fs.readFile(fullPath(assetFileName), 'utf8', callback);
}

// same as readAsset, but sync, return the content of given assetFileName;
function readAssetSync(assetFileName) {
  return fs.readFileSync(fullPath(assetFileName), 'utf8');
}

// write content to the asset named assetFileName. Will be overwritten if
// already existing. If error occurs, the callback is called with the error.
// Otherwise, when done the callback is called without any parameter.
// callback signature: (err)
function writeAsset(assetFileName, assetContent, callback) {
  var path = fullPath(assetFileName);
  createDirsIfNeeded(path);
  fs.writeFile(path, assetContent, 'utf8', callback);
}

module.exports = {
  getTheJSON: getTheJSON,
  readAsset: readAsset,
  readAssetSync: readAssetSync,
  writeAsset: writeAsset
};
