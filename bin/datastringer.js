#!/usr/bin/env node

'use strict';

var mailer = require('../mailer.js');
var argv = require('../lib/cli-configuration');
var Stringers = require('../lib/stringers');

var stringerUseCases = Stringers.fromObject(argv);

// now just run each use case
console.log(stringerUseCases.length + ' use case(s) to run...');
stringerUseCases.forEach(function(stringerName){
  var stringer = Stringers.load(stringerName);

  var params = JSON.parse(argv[stringerName] || '{}');
  var alertData = stringer.apply(null, params);

  if (alertData){
    mailer.sendAlert(argv.emailRecipient, stringerName, alertData);
  }
});