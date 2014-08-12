var O = require('./output.js');

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
    var localData;
    var remoteData;

    fs.readFile(path_to_JSON, 'utf8', function(err, data) {
      if (!err && data) {
        localData = JSON.parse(data);
      }
      pendingReq--;
      compareData();
    });

    local_police_uk.getData(force, neighbourhood, function(err, data) {
      if (!err) {
        remoteData = data;
      }
      pendingReq--;
      compareData();
    });

    function compareData() {
      // TODO deep equality test of remote data and local data
      // if (remote data != local data)
      //   store remote data as the next local data for reference
      //   fire the call back with a summary of the changes
    }
  }
);

