var ass = require('assert'); // huh huh

var tests = new Array();

tests.push({
  name: 'build a dataframe',
  fun: function() {
    var DF = require('./dataframe.js');

    var now = new Date(Date.now());
    var data = {'antisocial-behavior': 42, 'bike-theft': 51};
    var df = DF.makeDataFrame(now, data);
    ass.deepEqual(df.data, data);
    ass.deepEqual(df.date, now);
  }
});

tests.push({
  name: 'build a datasource',
  fun: function() {
    var DS = require('./datasource.js');

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
    ass.equal(ds.name, name);
    ass.equal(ds.description, desc);
    ass.deepEqual(ds.hasNewDataSince, hasNewsSince);
    ass.deepEqual(ds.getData, getData);
  }
});


console.log('running ' + tests.length + ' unit tests...');
console.log();

var fails = new Array();
for (var i = 0; i < tests.length; i++) {
  try {
    process.stdout.write(tests[i].name + ' ... ');
    tests[i].fun();
    console.log('OK');
  }
  catch(e) {
    console.log('KO');
    fails.push({name: tests[i].name, except: e});
  }
}

console.log()
console.log('success: ' + (tests.length - fails.length));
console.log('failures:  ' + fails.length);

for(var i = 0; i < fails.length; i++) {
  console.log();
  console.log(fails[i].name + ':');
  var e = fails[i].except;
  console.log(e.message);
  console.log('Got ' + e.actual + ', expected ' + e.expected);
}

