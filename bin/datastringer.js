#!/usr/bin/env node

'use strict';

var mailer = require('../mailer.js');
var argv = require('../lib/cli-configuration');
var Stringers = require('../lib/stringers');

var stringerUseCases = Stringers.fromObject(argv);
var stringerApi = require('../lib/api')();

// now just run each use case
console.log(stringerUseCases.length + ' use case(s) to run...');
stringerUseCases.forEach(function(stringerName){
  var stringer = Stringers.load(stringerName);

  var params = JSON.parse(argv[stringerName] || '{}');

  stringer.call(null, stringerApi, params)
    .then(function(alertData){
      mailer.sendAlert(
        argv.emailRecipient,
        stringerName,
        stringerApi.formatStringerResult(stringerName, alertData)
      );
    })
    .catch(console.error.bind(console));
});