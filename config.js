var fs = require('fs');

var confPath = __dirname + '/assets/config.json';

function readConfig() {
  var conf = {};

  try {
    conf = require(confPath);
  }
  catch(e) {
    console.log("Inexistent or invalid configuration file. A blank configuration " +
        "will be created");
  }

  return conf;
}

function writeConfig(conf, callback) {
  fs.writeFile(confPath, JSON.stringify(conf), function(err) {
    callback(err);
  });
}

module.exports.readConfig = readConfig;
module.exports.writeConfig = writeConfig;
