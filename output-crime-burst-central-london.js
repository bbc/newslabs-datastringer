var O = require('./output.js');

module.exports.output = O.makeOutput(
  'output-crime-burst-central-london', // name

  'monitor the crime stats from central London. Trigger when there is a burst ' +
  'of 10 percents over the 6 months preceding the time of the check.', // description

  ['police-uk'], // array containing the names of datasources used by output

  function check(datasourcesDict, callback) {
    // TODO in fact, should choose the right datasources from the given array
    // (return false or throw if needed sources are absent), query them for the
    // needed data (over the good range of time, with the right lat/lng etc.),
    // make stats and return true/false based on the outcome.

    // check that all the datasources that we need are here.
    for (var i = 0; i < this.sources.length; i++) {
      if (!(this.sources[i] in datasourcesDict)) {
        callback("Datasource '" + sources[i] + "' not found in " + datasourcesDict);
        return;
      }
    }

    var police_uk = datasourcesDict['police-uk'];
    var to = new Date(Date.now());
    var from = new Date(to);
    from.setMonth(from.getMonth() - 5); // query data for the past 6 months.

    // TODO that's just for the example. There should a nice way to input these
    // from a GUI.
    var lat = 51.529251355189885;
    var lng = -0.1490020751953125;

    police_uk.getData(from, to, lat, lng, processStats);

    function processStats(crimeStats) {
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
    }
  }
);

