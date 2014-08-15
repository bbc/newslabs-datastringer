var express = require('express'),
    cfg = require('./config.js');

var config = cfg.readConfig();

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/wizard'));
app.use(express.json());
app.use(express.urlencoded());

app.post('/configure/police-uk-crime-stats', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Get new config option
  config["police-uk-crime-stats"] = {
    lat: req.body.lat,
    lng: req.body.lng,
    from: req.body.from,
    to: req.body.to
  };
  // Write config file
  cfg.writeConfig(config, function (err) {
    if (err) {
      console.log("Unable to write to config file: ", err);
      res.json(false);
    } else {
      console.log("Wrote new config file");
      res.json(true);
    }
  });
});

app.post('/configure/police-uk-local-info', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Get new config option
  config["police-uk-local-info"] = {
    force: req.body.force,
    neighbourhood: req.body.neighbourhood
  };
  // Write config file
  cfg.writeConfig(config, function (err) {
    if (err) {
      console.log("Unable to write to config file: ", err);
      res.json(false);
    } else {
      console.log("Wrote new config file");
      res.json(true);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started on port %d', app.get('port'));
});

