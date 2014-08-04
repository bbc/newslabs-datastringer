window.onload = function() {

  var crimeArray = new Array(5);
  var crimeTypeName = 'anti-social-behaviour';

  //Defines map
  //Attaches event to "click"
  var map = new GMaps({
    div: '#map',
    lat: 51.5286417,
    lng: -0.1015987,
    zoom: 12,
    click: function(event) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      $('#latlng').val(lat + ', ' + lng);

      crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" +
        lat + "&lng=" + lng + "&date=2014-01", "#jan", 0);
      crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" +
        lat + "&lng=" + lng + "&date=2014-02", "#feb", 1);
      crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" +
        lat + "&lng=" + lng + "&date=2014-03", "#march", 2);
      crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" +
        lat + "&lng=" + lng + "&date=2014-04", "#april", 3);
      crimeQuery("http://data.police.uk/api/crimes-street/all-crime?lat=" +
        lat + "&lng=" + lng + "&date=2014-05", "#may", 4);
    }
  });

  function crimeQuery(path_json, div_id, crimeArrayIndex) {
    $.getJSON(path_json, function(data) {
      $("#map").remove();

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
      var $table = $("<table></table>");
      crimeTypes.forEach(function(type) {
        var $line = $("<tr></tr>");
        $line.append($("<td></td>").html(type));
        $line.append($("<td></td>").html(crime[type]));
        $table.append($line);
      });
      $table.appendTo($(div_id));

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

    $("#results").append("<p></p>").html("The average of " + crimeTypeName +
      "  arrests per month is " + Math.round(av) + "<br>" + "This month, " +
      crimeTypeName + " arrests changed by " + Math.round(diff) + "%");
  }

}
