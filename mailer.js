var nm = require("nodemailer");
var t = nm.createTransport();

function sendAlert(outputName, alertContent) {
  t.sendMail({
    from: "bot@data.string.er",
    to: config.userEmail,
    subject: "ALERT for " + outputName,
    text: "On today's run, " + outputName + "generated an alert, with the " +
        "following content:\n" + alertContent // TODO pretty print the object
  },
  function(err, info) {
    if(err) {
      console.log(err);
    }
  });
}

function sendError(outputName, error) {
  t.sendMail({
    from: "bot@data.string.er",
    to: config.userEmail,
    subject: "ERROR for " + outputName,
    text: "On today's run, " + outputName + "generated this error: " + error +
        "\nIf it is one of the build-in datasources, you can contact the " +
        "project maintener on github (http://github.com/basilesimon/datastringer)"
  },
  function(err, info) {
    if(err) {
      console.log(err);
    }
  });
}

module.exports = {
  sendAler: sendAlert,
  sendError: sendError
};
