var nm = require("nodemailer");
var t;

if (process.env.MANDRILL_USERNAME) {
  t = nm.createTransport({ service: 'Mandrill', auth: {
    user: process.env.MANDRILL_USERNAME,
    pass: process.env.MANDRILL_APIKEY
  }});
}
else {
  t = nm.createTransport();
}


function sendAlert(recipient, stringerName, alertContent) {
  t.sendMail({
    from: "bot@data.string.er",
    to: recipient,
    subject: "ALERT for " + stringerName,
    text: "On today's run, " + stringerName + "generated an alert, with the " +
	"following content:\n" + alertContent // TODO pretty print the object
  },
  function(err, info) {
    if(err) {
      console.log(err);
    }
  });
}

module.exports = {
  sendAlert: sendAlert
};
