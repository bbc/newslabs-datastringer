var ass = require('assert'); // huh huh
var fs = require('fs');
var jsonfn = require('jsonfn');

var tests = new Array();

// ACTUAL TEST DEFINITIONS ////////////////////////////////////////////////////

tests.push({
  name: 'build a dataframe',
  fun: function(testFinishedCB) {
    var testName = this.name;
    var DF = require('../dataframe.js');

    var now = new Date(Date.now());
    var data = {'antisocial-behavior': 42, 'bike-theft': 51};
    var df = DF.makeDataFrame(now, data);

    try{
      ass.deepEqual(df.data, data);
      ass.deepEqual(df.date, now);
    }
    catch(e) {
      testFinishedCB(testName, e);
      return;
    }

    testFinishedCB(testName);
  }
});

tests.push({
  name: 'build a datasource',
  fun: function(testFinishedCB) {
    var testName = name;
    var DS = require('../datasource.js');

    var name = 'crime-stats';
    var desc = 'Crime statistics from police.uk';
    var hasNewsSince = function(date) {
      return date < new Date('2014-05-1');
    }
    var getData = function(from, to) {
      var result;
      result.push(DF.makeDataFrame(new Date('2014-04-01'),
          {'anti-social-behavior': 42, 'bike-theft': 51}));
      result.push(DF.makeDataFrame(new Date('2014-05-01'),
          {'anti-social-behavior': 45, 'bike-theft': 66}));
      return result;
    }

    var ds = DS.makeDataSource(name, desc, hasNewsSince, getData);

    try {
      ass.equal(ds.name, name);
      ass.equal(ds.description, desc);
      ass.deepEqual(ds.hasNewDataSince, hasNewsSince);
      ass.deepEqual(ds.getData, getData);
    }
    catch(e) {
      testFinishedCB(testName, e);
      return;
    }
    testFinishedCB(testName);
  }
});

// END OF TEST DEFINITIONS ////////////////////////////////////////////////////

console.log('running ' + tests.length + ' unit tests...');
console.log();

var testsSuccessful = 0;
var testsFailed = 0;
var fails = [];

for (var i = 0; i < tests.length; i++) {
  console.log('Running ' + tests[i].name + '...');
  tests[i].fun(onTestFinished);
}

function onTestFinished(name, error) {
  if (!error) {
    testsSuccessful++;
  }
  else {
    testsFailed++;
    fails.push({testName: name, err: error});
  }

  if ((testsFailed + testsSuccessful) == tests.length) {
    console.log();
    console.log('All tests ran.');
    console.log('Success: ' + testsSuccessful);
    console.log('Failures: ' + testsFailed);
    if (fails.length) {
      console.log(fails);
    }
  }
}
