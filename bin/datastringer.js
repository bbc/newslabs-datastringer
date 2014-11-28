#!/usr/bin/env node

'use strict';

var mailer = require('../mailer.js');
var argv = require('../lib/cli-configuration');

console.log(argv);

return;

var stringerUseCases = [];

// try to load the stringer use cases
//var stringerUseCasesPath = __dirname + '/assets/stringers_use_cases.json';
//try {
//  stringerUseCases = require(stringerUseCasesPath);
//}
//catch (e) {
//  console.log('Error while loading stringer use cases from ' + stringerUseCasesPath +
//      ': ', e);
//  return;
//}

// now just run each use case
console.log(stringerUseCases.length + ' use case(s) to run...');
stringerUseCases.forEach(function(useCase){
  var stringer;
  try {
    stringer = require("./" + useCase.stringer);
  }
  catch (e) {
    console.log('Error while loading ' + useCase.stringer + ': ', e);
    console.log('Skipping to the next use case');
  }

  // append the onAlert callback to the parameters array and make a call to the
  // stringer.
  var params = useCase.parameters;
  params.push(onAlert);
  stringer.apply(this, params);
});

// the callback if a stringer use case is positive
function onAlert(stringerName, alertData) {
  if (stringerName) {
    mailer.sendAlert(argv.emailRecipient, stringerName, alertData);
  }
  else {
    console.log('Got an alert with some data but no stringer name. ' +
	'Here is the data anyway: ', alertData);
  }
}
