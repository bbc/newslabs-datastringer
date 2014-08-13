#!/bin/sh

echo "Installing datastringer, hang on tight..."

# execute the job at 12:00 each day
(crontab -l ; echo "0 12 * * * node $(pwd)/datastringer.js") 2>&1 | sed "s/no crontab for $(whoami)//" | sort | uniq | crontab -

echo "Done! Sit back and relax!"
