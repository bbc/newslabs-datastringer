var O = require('./output.js');
var fs = require('fs');
var diff = require('lodash.difference');

module.exports.output = O.makeOutput(
  'output-local-police', // name

  'monitors the changes in local police forces, new events annoucements, and new priorities.', // description

  ['local-police-uk'], // array containing the names of datasources used by output

  function check(datasourcesDict, checkDoneCallback) {
    var outputName = this.name;

    // check that all the datasources that we need are here.
    for (var i = 0; i < this.sources.length; i++) {
      if (!(this.sources[i] in datasourcesDict)) {
        checkDoneCallback("Datasource '" + sources[i] + "' not found in " +
            datasourcesDict, outputName);
        return;
      }
    }

    var local_police_uk = datasourcesDict['local-police-uk'];

    // TODO get the lat lng parameters from the GUI
    var force = "metropolitan";
    var neighbourhood = "00ACGD";

    var pendingReq = 2;
    var localData = {};
    var remoteData = {};

    var referenceDataFilePath = 'assets/local-police-reference.json';

    fs.readFile(referenceDataFilePath, 'utf8', function(err, data) {
      if (!err && data) {
        localData = JSON.parse(data);
      }
      compareData();
    });

    local_police_uk.getData(force, neighbourhood, function(err, data) {
      if (!err) {
        remoteData = data;
      }
      compareData();
    });

    function compareData() {
      pendingReq--;
      if (pendingReq > 0) {
        return; // all data isnt there yet.
      }

      var differenceSummary = {
        people: diff(remoteData.people, localData.people),
        events: diff(remoteData.events, localData.events),
        priorities: diff(remoteData.priorities, localData.priorities)
      };
      var difference = (
          differenceSummary.people.length ||
          differenceSummary.events.length ||
          differenceSummary.priorities.length);

      if (difference) {
        fs.writeFile(referenceDataFilePath, JSON.stringify(remoteData), 'utf8',
        function(err) {
          console.log('Error while writing reference data for local-police to ' +
              referenceDataFilePath + ': ' + err);
        });

        checkDoneCallback(undefined, outputName, differenceSummary);
      }
    }
  }
);

