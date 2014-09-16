var nm = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var utils = require('./utils.js');

function createTransport() {
  var mailerSetup = null;

  try {
    mailerSetup = utils.readAssetSync('mailer-setup.json');
  } catch(e) {
    console.log('No mailer configuration found, defaulting');
  }

  // If we fail to read smtp conf file, just
  // default to a standard smtp setup.
  if(!mailerSetup) {
    return nm.createTransport();
  }
  // or do fine tuned smtp setup if we have data!
  return nm.createTransport(smtpTransport(mailerSetup));
}

module.exports = {
  createTransport: createTransport
};
