var DS = require('./datasource.js')

module.exports.dataSource = DS.makeDataSource(
  'police-uk', // name

  'Some crime stats', // description

  function hasNewsSince(date) {
    var threshold = new Date('2014-05-01');
    return date > threshold;
  },

  function getData(from, to, lat, lng) {
    var crimeArray = new Array(5);
    var crimeTypeName = "anti-social-behaviour";

    crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng + "&date=2014-01", 0);
    crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng + "&date=2014-02", 1);
    crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng + "&date=2014-03", 2);
    crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng + "&date=2014-04", 3);
    crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" + lat + "&lng=" + lng + "&date=2014-05", 4);

    function crimeQuery(path_json, crimeArrayIndex) {
      var dataFinal = new Array();

      $.getJSON(path_json, function(data) {
        var crime = {};

        data.forEach(function(item) {
          if (!(item.category in crime)) {
            crime[item.category] = 1; // 1st crime seen for this category
          } else {
            crime[item.category] += 1;
          }
        })

        crimeArray[crimeArrayIndex] = crime;

        var crimeTypes = Object.keys(crime).sort();

        var ok = true;
        for (var i = 0; i < crimeArray.length; i++) {
          if (!crimeArray[i]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          stats(crimeTypeName);
        }
      });
    }

    function stats(crimeType) {
      var average = function(valueArray) {
        var average = 0;
        valueArray.forEach(function(v) {
          average += v;
        });
        return average / valueArray.length;
      }

      // extract the relevant data from crimeArray
      // number of crimes per month for the given crimeTypeName.
      var statsArray = [];
      for (var i = 0; i < crimeArray.length; i++) {
        if (crimeType in crimeArray[i]) {
          statsArray.push(crimeArray[i][crimeType]);
        } else {
          statsArray.push(0);
        }
      }

      var av = average(statsArray);
      var diff = (statsArray[statsArray.length - 1] / av * 100) - 100;

      console.log("The average of " + crimeTypeName + "arrests per month is " + Math.round(av));
      console.log("This month, " + crimeTypeName + "arrests changed by " + Math.round(diff) + "%");

      //TODO: fix that so it takes into account the several crimeTypeName we have.
      //see opened issue on Github
      dataFinal.push({"average-arrests-per-month": Math.round(av)});
      dataFinal.push({"delta-to-6-months": Math.round(diff)});
    }

    //SHOULD RETURN ARRAY OF DATA FRAMES - WTF THAT IS
    return datafinal;
  }
);
