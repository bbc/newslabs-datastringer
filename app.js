var express = require('express'),
    fs = require('fs'),
    config = {};

// Attempt to load config file
try {
    config = require(__dirname + '/assets/config.json');
    console.log("Existing config file found");
} catch (e) {
    console.log("No config file found, or invalid file: ", e,
        ". A new file will be created");
}

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/wizard'));
app.use(express.json());
app.use(express.urlencoded());

app.post('/configure', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  // Get new config option
  var newConfig = {
    lat: req.body.lat,
    lng: req.body.lng,
    from: req.body.from,
    to: req.body.to
  };
  // Write config file
  fs.writeFile(__dirname + '/assets/config.json', JSON.stringify(newConfig), function (err) {
    if (err) {
      console.log("Unable to write to config file: ", err);
      res.json(false);
    } else {
      console.log("Wrote new config file");
      config = newConfig; // Use new config
      res.json(true);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started on port %d', app.get('port'));
});

