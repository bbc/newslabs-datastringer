'use strict';

module.exports = require('yargs')
  .options('email-recipient', {
    alias: 'er',
    required: true,
    description: 'Email recipient to send the alerts to.'
  })
  .argv;