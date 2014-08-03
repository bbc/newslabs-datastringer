window.onload = function() {

var crimeArray = new Array(5);
var crimeTypeIndex = 0; // could be modified from the browser through a combobox.

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
    var categories = new Array();
    //will be filled with total numbers for each crime category
    var crimeNumbers = new Array();

    var categories = _.pluck(data, 'category'); //list all values
    var categories = _.uniq(categories); //boils down to unique values

    for (var i = 0; i < categories.length; i++) {
      var totalByCategory = _.filter(data, function(data) {
        return data.category == categories[i]
      });
      crimeNumbers.push(totalByCategory.length);
    }

    var crime = _.zip(categories, crimeNumbers); //assembles the two arrays
    crimeArray[crimeArrayIndex] = crime;

    var $table = $("<table></table>");
    for (var y = 0; y < crime.length; y++) {
      var $line = $("<tr></tr>");
      $line.append($("<td></td>").html(crime[y][0]));
      $line.append($("<td></td>").html(crime[y][1]));
      $table.append($line);
    }
    $table.appendTo($(div_id));

    var ok = true;
    for (var i = 0; i < crimeArray.length; i++) {
      if(!crimeArray[i]) {
        ok = false;
        break;
      }
    }
    if(ok) {
      stats(0);
    }
  });
}

function stats(crimeTypeIndex) {
  var average = function(valueArray) {
    var average = 0;
    valueArray.forEach(function(v) { average += v; } );
    return average / valueArray.length;
  }

  // extract the relevant data from crimeArray
  // number of crimes per month for the given crimeTypeIndex.
  var statsArray = [];
  for (var i = 0; i < crimeArray.length; i++) {
    statsArray.push(crimeArray[i][crimeTypeIndex][1]);
  }

  var av = average(statsArray);
  var diff = (statsArray[statsArray.length - 1] / av * 100) - 100;

  var crimeName = crimeArray[0][crimeTypeIndex][0];
  $("#results").append("<p></p>").html("The average of " + crimeName +
    "  arrests per month is " + Math.round(av) + "<br>" + "This month, " +
    crimeName + " arrests changed by " + Math.round(diff) + "%");
}

}

