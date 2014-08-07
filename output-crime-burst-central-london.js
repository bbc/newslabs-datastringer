var O = require('./output.js');

module.exports.output = O.makeOutput(
  'output-crime-burst-central-london', // name

  'monitor the crime stats from central London. Trigger when there is a burst ' +
  'of 10 percents over the 6 months preceding the time of the check.', // description

  ['police-uk'], // array containing the names of datasources used by output

  function check(datasourcesArray) {
    // TODO in fact, should choose the right datasources from the given array
    // (return false or throw if needed sources are absent), query them for the
    // needed data (over the good range of time, with the right lat/lng etc.),
    // make stats and return true/false based on the outcome.
    return true;
  }
);

