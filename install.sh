#!/bin/sh

echo "Installing datastringer, hang on tight..."

# Install postfix to be able to send mails. Note that just apt-get installing it
# is probably not right - ubuntu is not the only system around after all.
# We probably just should try to find it and then kindly warn the user if it is
# not found.
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' postfix | grep "install ok installed")
if [ "" = "$PKG_OK" ]
then
  echo "Installing postfix"
  sudo apt-get --force-yes --yes install postfix
fi
echo postfix installed!

if ! which node > /dev/null
then
  if ! which nodejs > /dev/null
  then
    echo "Installing node"
    sudo apt-get --force-yes --yes install nodejs
  fi
fi
echo node installed!

# Storing how NodeJS is meant to be called
set NODEJS_COMMAND = 'node'
if ! which ${NODE_COMMAND} > /dev/null
then
  set NODEJS_COMMAND = 'nodejs'
fi

if ! which npm > /dev/null
then
  echo "Installing npm"
  sudo apt-get --force-yes install npm
fi
echo npm installed!

echo "Installing needed node modules"
npm install

echo "Setting up CRON job"
# execute the job at 12:00 each day
(crontab -l ; echo "0 12 * * * ${NODEJS_COMMAND} $(pwd)/datastringer.js") 2>&1 | sed "s/no crontab for $(whoami)//" | sort | uniq | crontab -

echo "Done! Sit back and relax!"
