var O = require('./output.js');

module.exports.output = O.makeOutput(
  'output-local-police', // name

  'monitors the changes in local police forces, new events annoucements, and new priorities.', // description

  ['local-police-uk'], // array containing the names of datasources used by output

  function check(datasourcesDict, callback) {
    // check that all the datasources that we need are here.
    for (var i = 0; i < this.sources.length; i++) {
      if (!(this.sources[i] in datasourcesDict)) {
        callback("Datasource '" + sources[i] + "' not found in " + datasourcesDict);
        return;
      }
    }

    var local_police_uk = datasourcesDict['local-police-uk'];

    // TODO get the lat lng parameters from the GUI
    var force = "metropolitan";
    var neighbourhood = "00ACGD";
    var lat = 51.529251355189885;
    var lng = -0.1490020751953125;

    local_police_uk.getData(force, neighbourhood, checkChange);

    function checkChange(dataFinal) {
      console.log(dataFinal);
    }

    /*function processStats(crimeStats) {
      // compute the total amount of crime for each crime
      var totCrimes = [];
      for (var i = 0; i < crimeStats.length; i++) {
        var totalCrime = 0;
        var types = Object.keys(crimeStats[i]);
        for (var t = 0; t < types.length; t++) {
          totalCrime += crimeStats[i][t];
        }
        totCrimes.push(totalCrime);
      }

      // compute the average of crimes per month
      var avg = 0;
      for (var m = 0; m < totCrimes.length; m++) {
        avg += totCrimes[m];
      }
      avg /= totCrimes.length;

      var dif = (totCrimes[totCrimes.length - 1] / avg * 100) - 100;

      // TODO that 10 percents also are here for the sake of the example and
      // should be parametrized somehow.
      if (Math.abs(dif) >= 10) {
        callback(undefined, dif);
      }
    }*/
  }
);

