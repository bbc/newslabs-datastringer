window.onload = function() {

var crimeArray = new Array(5);

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

function crimeQuery(path_json, div_id, crimeIndex) {
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
    crimeArray[crimeIndex] = crime;

    var tableData = crime;
    var $table = $("<table></table>");

    for (var y = 0; y < tableData.length; y++) {
      var $line = $("<tr></tr>");
      $line.append($("<td></td>").html(tableData[y][0]));
      $line.append($("<td></td>").html(tableData[y][1]));
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
      stats();
    }
  });
}

function stats() {
  //Functions
  function stuff(month1, month2, month3, month4, month5, total) {
    var av = (month1 + month2 + month3 + month4 + month5) / total;
    var diff = (month5 / av * 100) - 100;
    return {
      average: av,
      monthDiff: diff
    };
  };

  var stat1 = crimeArray[0];
  var stat2 = crimeArray[1];
  var stat3 = crimeArray[2];
  var stat4 = crimeArray[3];
  var stat5 = crimeArray[4];
  var numberOfMonths = 5;

  var average1 = stuff(stat1[0][1], stat2[0][1], stat3[0][1], stat4[0][1], stat5[0][1], 5);
  console.log("The average " + stat1[0][0] + " arrests is: " + Math.round(average1.average));
  console.log("This month, " + stat1[0][0] + "  arrests changed by: " + Math.round(average1.monthDiff) + "%");
  $("#results").append("<p></p>").html("The average of" + stat1[0][0] + "  arrests per month is " + Math.round(average1.average) + "<br>" + "This month, " + stat1[0][0] + " arrests changed by " + Math.round(average1.monthDiff) + "%");

  /*@TODO in stats()
    function stuff( as many parameters as we have gVar.crimeArray ) {
      calculate average
      valculate diff
      return {
        average: av,
        monthDiff: diff
      }
    } see line 138 and following

    append to #results:
    "The average of " + stat5[i][0] + (...) + average
    Same thing for diff
    see line 157 for example
  */
}

}

