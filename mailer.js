var nm = require("nodemailer");
var utils = require('./utils.js');
var t = nm.createTransport();

function sendAlert(stringerName, alertContent) {
  utils.readAsset('user-email.json', function(err, data) {
    t.sendMail({
      from: "bot@data.string.er",
      to: data,
      subject: "ALERT for " + stringerName,
      text: "On today's run, " + stringerName + "generated an alert, with the " +
          "following content:\n" + alertContent // TODO pretty print the object
    },
    function(err, info) {
      if(err) {
        console.log(err);
      }
    });
  });

}

module.exports = {
  sendAlert: sendAlert,
};
