var DS = require('./datasource.js');
var makeDataFrame = require('./dataframe.js').makeDataFrame;

module.exports.dataSource = DS.makeDataSource(
  'police-uk', // name

  'Some crime stats', // description

  function hasNewsSince(date) {
    // TODO use http://data.police.uk/api/crime-last-updated and compare date to
    // the returned timestamp
    var threshold = new Date('2014-05-01');
    return date > threshold;
  },

  function getData(from, to, lat, lng) {
    // let currDate be the 1st of current month if day <= 15, 1st of next month
    // otherwise
    var currDate = from;
    if (currDate.getDay() <= 15) {
      currDate.setDate(1);
    }
    else {
      currDate.setDate(32) // will go to 1st of next month
    }

    var crimeArray = new Array();
    var baseQuery =
        "http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng;

    while (currDate <= to) {
      var currMonth = currDate.getMonth() + 1; // months start at 0 ¬_¬
      currMonth = currMonth > 9 ? String(currMonth) : '0' + String(currMonth);
      var timeQuery = "&date=" + currDate.getFullYear() + "-" + currMonth;

      var data = crimeQuery(baseQuery + timeQuery);
      crimeArray.push(makeDataFrame(currDate, data));

      currDate.setMonth(currDate.getMonth() + 1); // go to the next dataframe
    }

    return crimeArray;
  }
);

function crimeQuery(path_json, crimeArrayIndex) {
  var monthCrimeStat = {};

  $.ajax({
    url: path_json,
    async: false,
    success: process(result)
  });

  function process(data) {
    for(var i = 0; i < data.length; i++) {
      if (!(data[i].category in crime)) {
        monthCrimeStat[data[i].category] = 0; // 1st crime seen for this category
      }
      monthCrimeStat[data[i].category] += 1;
    }
  };

  return monthCrimeStat;
}

