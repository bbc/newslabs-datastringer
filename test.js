var ass = require('assert'); // huh huh

var tests = new Array();

tests.push({
  name: 'someTest',
  fun: function(){
    ass.fail(3, 4, 'lol no');
}});

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

