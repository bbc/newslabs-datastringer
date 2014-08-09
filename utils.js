var h = require('http');

function getTheFuckingJSON(opt, callback) {
  var json = String();

  var req = h.request(opt, function(response) {
    response.on('data', function(data) {json += data});
    response.on('end', function() {
      callback(undefined, json);
    });
  }).on('error', function(err){
    callback(err, json)
  });

  req.end();
}

module.exports.getTheFuckingJSON = getTheFuckingJSON;
