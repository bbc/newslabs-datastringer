var fs = require('fs');
var sync = require('synchronize');
var diff = require('lodash.difference');
var utils = require('./utils.js');
var getTheJSON = require('./utils').getTheJSON;

function stringer(force, neighbourhood, triggerAlert) {
  var remoteData = {people: [], events: [], priorities:[]};
  var refData = {people: [], events: [], priorities: []};
  var refDataFilePath = 'local-police-stringer-reference/' + force + '-' +
      neighbourhood + '.json';

  var baseQuery = "http://data.police.uk/api/" + force + '/' + neighbourhood;

  sync.fiber(function() {
    var people = JSON.parse(
        sync.await(getTheJSON(baseQuery + "/people", sync.defer())));
    var events = JSON.parse(
        sync.await(getTheJSON(baseQuery + "/events", sync.defer())));
    var priori = JSON.parse(
        sync.await(getTheJSON(baseQuery + "/priorities", sync.defer())));

    for (var p = 0; p < people.length; p++) {
      remoteData.people.push(people[p].name);
    }
    for (var e = 0; e < events.length; e++) {
      remoteData.events.push(events[e].title);
    }
    for (var i = 0; i < priori.length; i++) {
      remoteData.priorities.push(priori[i].issue);
    }

    try {
      refData = JSON.parse(
          sync.await(utils.readAsset(refDataFilePath, sync.defer())));
    }
    catch (err) {
      console.log('woops, no reference data for ' + force + ', ' + neighbourhood + ': ', err);
    }

    compareData();
  });

  function compareData() {
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
      utils.writeAsset(refDataFilePath, JSON.stringify(remoteData), function(err) {
        if (err) {
          console.log('woops, could not write back reference data for ' + force +
              ', ' + neighbourhood + ': ', err);
        }
      });
      triggerAlert('local-police-stringer', JSON.stringify(differenceSummary, null, 2));
    }
  }
}

module.exports = stringer;
