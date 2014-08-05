var fs = require('fs');

var dataSources = [];
var outputs = [];

// load datasources
var parsedJSON = JSON.parse(fs.readFileSync('datasources.json', 'utf8'));
for (var i = 0; i < parsedJSON.length; i++) {
  var DS = require(parsedJSON[i]);
  dataSources.push(DS.dataSource);
}

// load outputs
var parsedJSONOutput = JSON.parse(fs.readFileSync('outputs.json', 'utf8'));
for (var i = 0; i < parsedJSONOutput.length; i++) {
  var O = require(parsedJSONOutput[i]);
  outputs.push(O.output);
}

var news = [];

for (var i = 0; i < dataSources.length; i++) {
  console.log('checking for news for ' + dataSources[i].name);

  // TODO store the data of last update in some JSON.
  if (dataSources[i].hasNewDataSince(new Date(Date.now()))) {
    news.push(dataSources[i].name);
  }
}

console.log();
console.log('News in: ' + news);
