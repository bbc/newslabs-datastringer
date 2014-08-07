var DS = require("./datasource.js")

module.exports.datasource = DS.makeDataSource(
  "local-police-uk", //name
  "News from local force", //description

  function hasNewsSince(date) {
    var threshold = new Date('2014-05-01');
    return date > threshold;
  },

  function getData(from, to, lat, lng) {

    getNeighbourhood("http://data.police.uk/api/locate-neighbourhood?q=" + lat + "," + lng);

    var yourNeighbourhood = new Array();

    function getNeighbourhood(path_json) {
      $.getJSON(path_json, function(data) {

        yourNeighbourhood.push(data.force, data.neighbourhood);

        if (yourNeighbourhood.length > 1) {
          getNeighbourhoodData()
        };
      });

      function getNeighbourhoodData() {
        var baseJSON = "http://data.police.uk/api/" + yourNeighbourhood[0] + "/" + yourNeighbourhood[1];

        //people
        $.getJSON(baseJSON + "/people", function(data) {
          var yourofficers = "";
          for (var i = 0; i < data.length; i++) {
            yourofficers += " " + data[i].name + ", ";
          }
          console.log("Your police officers are:" + yourofficers);
        });

        //events
        $.getJSON(baseJSON + "/events", function(data) {
          if (data.length == 0) {
            console.log("There are no announced events in your neighbourhood.");
          } else {
            for (var i = 0; i < data.length; i++) {
              console.log("Events announced: " + data[i].title);
            }
          }
        });

        //priorities
        $.getJSON(baseJSON + "/priorities", function(data) {
          var priorities = "";
          for (var i = 0; i < data.length; i++) {
            priorities += " " + data[i].issue + ", ";
          }
          console.log("Your local force's priorities are" + priorities);
        })
      }
    }
    //SHOULD RETURN ARRAY OF DATA FRAMES - WTF THAT IS
  }
);
