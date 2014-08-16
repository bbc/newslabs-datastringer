var fs = require('fs');
var sync = require('synchronize');
var diff = require('lodash.difference');
var getTheFuckingJSON = require('./utils').getTheFuckingJSON;

function stringer(force, neighbourhood, triggerAlert) {
  var remoteData = {people: [], events: [], priorities:[]};

  var baseQuery = "http://data.police.uk/api/" + force + '/' + neighbourhood;

  sync.fiber(function() {
    var people = JSON.parse(
        sync.await(getTheFuckingJSON(baseQuery + "/people", sync.defer())));
    var events = JSON.parse(
        sync.await(getTheFuckingJSON(baseQuery + "/events", sync.defer())));
    var priori = JSON.parse(
        sync.await(getTheFuckingJSON(baseQuery + "/priorities", sync.defer())));

    for (var p = 0; p < people.length; p++) {
      remoteData.people.push(people[p].name);
    }
    for (var e = 0; e < events.length; e++) {
      remoteData.events.push(events[e].title);
    }
    for (var i = 0; i < priori.length; i++) {
      remoteData.priorities.push(priori[i].issue);
    }

    compareData();
  });

  function compareData() {
    var refData = {people: [], events: [], priorities: []};
    var refDataFilePath = './assets/local-police-stringer-reference-' + force + '-' +
        neighbourhood + '.json';

    try {
      refData = require(refDataFilePath);
    }
    catch (e) {
      console.log('woops, no reference data for ' + force + ', ' + neighbourhood + ': ', e);
    }

    var differenceSummary = {
      people: diff(remoteData.people, refData.people),
      events: diff(remoteData.events, refData.events),
      priorities: diff(remoteData.priorities, refData.priorities)
    };
    var difference = (
        differenceSummary.people.length ||
        differenceSummary.events.length ||
        differenceSummary.priorities.length);

    if(difference) {
      fs.writeFile(refDataFilePath, JSON.stringify(remoteData), 'utf8', function(err) {
        if (err) {
          console.log('woops, could not write back reference data for ' + force +
              ', ' + neighbourhood + ': ', err);
        }
      });

      triggerAlert('local-police-stringer', differenceSummary);
    }
  }
}

module.exports = stringer;
