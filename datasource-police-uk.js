var DS = require('./datasource.js');
var makeDataFrame = require('./dataframe.js').makeDataFrame;
var sync = require('synchronize');
var getTheFuckingJSON = require('./utils.js').getTheFuckingJSON;

module.exports.dataSource = DS.makeDataSource(
  'police-uk', // name

  "#Police-uk\n" +
  "This source return the monthly crime statistics for a given localisation. It can " +
  "cover several months and will accordingly return several data points.\n" +

  "##getData parameters\n" + // TODO add the callback parameter
  "`getData` returns an array of data covering a temporal range. It accepts 4 " +
  "parameters:\n\n" +
  "- `from`: a `Date` object marking the start of the range" +
  "- `to`: a `Date` object marking the end of the range" +
  "- `lat`: the latitude of the localisation" +
  "- `lng`: the longitude of the localisation" +
  "- `getDataCallback`: the callback called when getData is done. Its signature is " +
  "`(error, data)`. The `error` parameter is `undefined` when no error happened.\n" +

  "##returned data format\n" +
  "The source returns a dataframe per month. The date attribute of the frame is\n" +
  "set to the first day of the month, and the data attribute carries an object.\n" +
  "This object has a field of each crime type (eg. `antisocial-behaviour` or \n" +
  "`bike-theft`), and the field's value is the monthly arrest count for this crime.",

  function hasNewsSince(date) {
    // TODO use http://data.police.uk/api/crime-last-updated and compare date to
    // the returned timestamp
    var threshold = new Date('2014-05-01');
    return date > threshold;
  },

  function getData(from, to, lat, lng, callback) {
    // let currDate be the 1st of current month if day <= 15, 1st of next month
    // otherwise
    var currDate = from;
    if (currDate.getDay() <= 15) {
      currDate.setDate(1);
    }
    else {
      currDate.setDate(32); // will go to 1st of next month
    }

    var crimeArray = [];
    var baseQuery =
        "http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng;

    sync.fiber(function() {
      while (currDate <= to) {
        var currMonth = currDate.getMonth() + 1; // months start at 0 ¬_¬
        currMonth = currMonth > 9 ? String(currMonth) : '0' + String(currMonth);
        var timeQuery = "&date=" + currDate.getFullYear() + "-" + currMonth;

        console.log('police-uk: fetching data for ' + timeQuery);
        try {
          var data = sync.await(crimeQuery(baseQuery + timeQuery, sync.defer()));
          crimeArray.push(makeDataFrame(new Date(currDate), data));
        }
        catch(e) {
          console.log('caught exception while fetching data for ' + currDate +
            ', skipping to next month');
        }
        currDate.setMonth(currDate.getMonth() + 1); // go to the next dataframe
      }
      callback(crimeArray);
    });
  }
);

function crimeQuery(path_json, callback) {
  getTheFuckingJSON(path_json, process);

  function process(err, json) {
    if (err) {
      callback(err);
      return;
    }

    var data = JSON.parse(json);
    var monthCrimeStat = {};
    for(var i = 0; i < data.length; i++) {
      if (!(data[i].category in monthCrimeStat)) {
        monthCrimeStat[data[i].category] = 0; // 1st crime seen for this category
      }
      monthCrimeStat[data[i].category] += 1;
    }
    callback(undefined, monthCrimeStat);
  }
}

