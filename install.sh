#!/bin/sh

echo "Installing datastringer, hang on tight..."

echo "Installing postfix"
# Install postfix to be able to send mails. Note that just apt-get installing it
# is probably not right - ubuntu is not the only system around after all.
# We probably just should try to find it and then kindly warn the user if it is
# not found.
sudo apt-get install postfix

echo "Installing needed node modules"
npm install

# execute the job at 12:00 each day
(crontab -l ; echo "0 12 * * * node $(pwd)/datastringer.js") 2>&1 | sed "s/no crontab for $(whoami)//" | sort | uniq | crontab -

echo "Done! Sit back and relax!"
