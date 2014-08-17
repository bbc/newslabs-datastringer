var express = require('express'),
    assetManager = require('./asset_manager.js');

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

  assetManager.writeAsset('stringers_use_cases.json', JSON.stringify(useCases, null, 2),
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
  assetManager.writeAsset('user-email.json', req.body.user_email, function(err) {
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
  assetManager.readAsset('stringers_use_cases.json', function(err, asset) {
    res.send(asset);
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started on port %d', app.get('port'));
});

