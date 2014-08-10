var sync = require("synchronize");
var getTheFuckingJSON = require("./utils.js").getTheFuckingJSON;
var DS = require("./datasource.js");

module.exports.dataSource = DS.makeDataSource(
  "local-police-uk", //name
  "News from local force", //description

  // TODO it feels like there is something to be done here.
  function hasNewsSince(date) {
    return true;
  },

  // like callback(err, result)
  function getData(force, neighbourhood, getDataCallback) {
    if (!force) {
      getDataCallback("datasource-local-police-uk: could not getData because 'force'" +
        " was not specified.");
      return;
    }

    var dataFinal = {people: [], events: [], priorities:[]};
    var pendingRequests = (neighbourhood ? 3 : 1);

    var baseQuery = "http://data.police.uk/api/" + force;
    if (neighbourhood) {
      baseQuery += "/" + neighbourhood;
    }

    getTheFuckingJSON(baseQuery + "/people", processPeople);
    // we need the neighbourhood param to get team events and priorities, so
    // there is no sense in going further if we don't have it.
    if (!neighbourhood) {
      return;
    }
    getTheFuckingJSON(baseQuery + "/events", processEvents);
    getTheFuckingJSON(baseQuery + "/priorities", processPriorities);

    function processPeople(error, peopleJSON) {
      if (error) {
        getDataCallback(error);
        return;
      }
      var people = JSON.parse(peopleJSON);
      for (var p = 0; p < people.length; p++) {
        dataFinal.people.push(people[p].name);
      }
      handleCallback();
    }

    function processEvents(error, eventsJSON) {
      if (error) {
        getDataCallback(error);
        return;
      }
      var events = JSON.parse(eventsJSON);
      for (var e = 0; e < events.length; e++) {
        dataFinal.events.push(events[e].title);
      }
      handleCallback();
    }

    function processPriorities(error, prioritiesJSON) {
      if (error) {
        getDataCallback(error);
        return;
      }
      var prio = JSON.parse(prioritiesJSON);
      for (var p = 0; p < prio.length; p++) {
        dataFinal.priorities.push(prio[p].issue);
      }
      handleCallback();
    }

    function handleCallback() {
      console.log(pendingRequests);
      pendingRequests--;
      if (pendingRequests === 0) {
        getDataCallback(undefined, dataFinal);
      }
    }
  }
);
