var express = require('express'),
    utils = require('./utils.js');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/wizard'));
app.use(express.json());
app.use(express.urlencoded());

var useCases = [];

app.post('/configure/crime-stringer', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  useCases[1] = {
    stringer: 'crime-stringer.js',
    parameters: [req.body.lat, req.body.lng, req.body.numberOfMonths, req.body.threshold]
  };

  res.json(true);
});

app.post('/configure/local-police-stringer', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  useCases[0] = {
    stringer: 'local-police-stringer.js',
    parameters: [req.body.force, req.body.neighbourhood]
  };

  res.json(true);
});

app.post('/configure/write', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  utils.writeAsset('stringers_use_cases.json', JSON.stringify(useCases, null, 2),
  function(err) {
    if (err) {
      res.json(false);
    }
    else {
      res.json(true);
    }
  });
});

app.post('/configure/user-email', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  utils.writeAsset('user-email.json', req.body.user_email, function(err) {
    if (err) {
      res.json(false);
    }
    else {
      res.json(true);
    }
  });
});

app.get('/configuration', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  utils.readAsset('stringers_use_cases.json', function(err, asset) {
    res.send(asset);
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started on port %d', app.get('port'));
});

process.on('uncaughtException', function(err) {
  if (err.errno === 'EADDRINUSE') {
    console.log('Unable to start server on port %d (is something already running on that port?)', app.get('port'));
  } else {
    console.log(err);
  }
  process.exit(1);
});