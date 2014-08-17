//todo: mettre le mois dans le triggerResult
var sync = require('synchronize');
var utils = require('./utils.js');

function stringer(lat, lng, numberOfMonths, threshold, callback) {

  sync.fiber(function() {
    // get last update date, so that we know where to start from.
    var dateJson = sync.await(utils.getTheJSON(
      "http://data.police.uk/api/crime-last-updated", sync.defer()));

    var currentDate = new Date(JSON.parse(dateJson).date);

    var lastUpdateTimeRef = new Date(0);
    try {
      var refJSON = sync.await(utils.readAsset('crime-stringer-reference/lastUpdate ' +
          lat + '-' + lng + '.json', sync.defer()));
      lastUpdateTimeRef = new Date(JSON.parse(refJSON));
    }
    catch(except) {
    }

    if (currentDate <= lastUpdateTimeRef) {
      return;
    }

    utils.writeAsset('crime-stringer-reference/lastUpdate.json', JSON.stringify(currentDate),
    function(err) {
      console.log(err);
    });

    var baseQuery = "http://data.police.uk/api/crimes-street/all-crime?lat=" +
      lat + "&lng=" + lng;

    // query crime stats for each month
    var crimeArray = [];
    while (numberOfMonths) {
      // build query for current month
      var currMonth = currentDate.getMonth() + 1; // months start at 0 ¬_¬
      currMonth = currMonth > 9 ? String(currMonth) : '0' + String(currMonth);
      var timeQuery = "&date=" + currentDate.getFullYear() + "-" + currMonth;

      console.log('police-uk: fetching data for ' + timeQuery);
      try {
        var data = sync.await(crimeQuery(baseQuery + timeQuery, sync.defer()));
        crimeArray.push(data);
      } catch (e) {
        console.log('caught exception while fetching data for ' + currentDate +
          ', skipping to next month');
      }

      currentDate.setMonth(currentDate.getMonth() - 1);
      numberOfMonths--;
    }

    // compute average for each category, over the time range
    var categories = Object.keys(crimeArray[0]);
    numberOfMonths = crimeArray.length;
    var categoryAverages = {};
    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      categoryAverages[cat] = 0;

      for (var i = 0; i < crimeArray.length; i++) {
        if (cat in crimeArray[i]) {
          categoryAverages[cat] += crimeArray[i][cat];
        }
      }

      categoryAverages[cat] /= numberOfMonths;
    }

    // for each category, compute the diff btw crime amount for last month and
    // average.
    // callback if > threshold
    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      var categoryDiff = (crimeArray[0][cat] / categoryAverages[cat] * 100) -
        100;

      if (Math.abs(categoryDiff) > Math.abs(threshold)) {
        callback('crime-stringer', cat + ', diff: ' + categoryDiff);
      }
    }
  });
} //stringer

function crimeQuery(path_json, callback) {
  utils.getTheJSON(path_json, process);

  function process(err, json) {
    if (err) {
      callback(err);
      return;
    }

    if (!json) {
      callback('No JSON could be fetched for ' + path_json);
      return;
    }

    var data = JSON.parse(json);
    var monthCrimeStat = {};
    for (var i = 0; i < data.length; i++) {
      if (!(data[i].category in monthCrimeStat)) {
        monthCrimeStat[data[i].category] = 0; // 1st crime seen for this category
      }
      monthCrimeStat[data[i].category] += 1;
    }
    callback(undefined, monthCrimeStat);
  }
}

module.exports = stringer;
