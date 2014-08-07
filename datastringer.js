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

console.log('DataSources: ' + parsedJSON);
console.log('Outputs: ' + parsedJSONOutput);
console.log();

// check which datasource has some new data to offer since last time.
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

// check which outputs have to be re-checked, based on which datasources have
// new data.
var outputsToCheck = [];
for (var i = 0; i < news.length; i++) {
  for (var j = 0; j < outputs.length; j++) {

    if (outputs[j].sources.indexOf(news[i]) != -1 &&
        outputsToCheck.indexOf(outputs[j]) == -1) {

      outputsToCheck.push(outputs[j]);
    }
  }
}

console.log();
console.log('Outputs inpacted by the news: ' + outputsToCheck);

// now just run the 'check' method of every outputs that needs to be checked.
for (var i = 0; i < outputs.length; i++) {
  if (outputs[i].check(dataSources)) {
    // send a mail, faire tourner un girophare, etc.
    console.log('ALERT, ouput ' + outputs[i].name + ' was triggered!');
  }
}
