var fs = require('fs');
var mailer = require('mailer.js');

var dataSources = {};
var outputs = {};

// load datasources
var parsedJSON = JSON.parse(fs.readFileSync('datasources.json', 'utf8'));
for (var i = 0; i < parsedJSON.length; i++) {
  var DS = require(parsedJSON[i]);
  dataSources[DS.dataSource.name] = DS.dataSource;
}

// load outputs
var parsedJSONOutput = JSON.parse(fs.readFileSync('outputs.json', 'utf8'));
for (var i = 0; i < parsedJSONOutput.length; i++) {
  var O = require(parsedJSONOutput[i]);
  outputs[O.output.name] = O.output;
}

console.log('DataSources: ' + parsedJSON);
console.log('Outputs: ' + parsedJSONOutput);
console.log();

// check which datasource has some new data to offer since last time.
var news = [];
var dsKeys = Object.keys(dataSources);
for (var i = 0; i < dsKeys.length; i++) {
  var k = dsKeys[i];
  console.log('checking for news for ' + dataSources[k].name);

  // TODO store the data of last update in some JSON.
  if (dataSources[k].hasNewDataSince(new Date(Date.now()))) {
    news.push(dataSources[k].name);
  }
}

console.log();
console.log('News in: ' + news);

// check which outputs have to be re-checked, based on which datasources have
// new data.
var outputsToCheck = [];
var oKeys = Object.keys(outputs);
for (var i = 0; i < news.length; i++) {
  for (var j = 0; j < oKeys.length; j++) {
    var k = oKeys[j];

    if (outputs[k].sources.indexOf(news[i]) != -1 &&
        outputsToCheck.indexOf(k) == -1) {

      outputsToCheck.push(k);
    }
  }
}

console.log();
console.log('Outputs inpacted by the news: ' + outputsToCheck);

// now just run the 'check' method of every outputs that needs to be checked.
for (var i = 0; i < outputsToCheck.length; i++) {
  var oKey = outputsToCheck[i];
  outputs[oKey].check(dataSources, onCheckDone);
}

function onCheckDone(error, name, checkResult) {
  if(!error && checkResult) {
    mailer.sendAlert(name, checkResult);
  }
  else if (error) {
    mailer.sendError(name, error);
  }
}
