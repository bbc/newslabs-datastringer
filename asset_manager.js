var fs = require('fs');

var assetsRootFolder = 'assets/';

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
  readAsset: readAsset,
  writeAsset: writeAsset
};

