FROM ubuntu:16.04

RUN apt-get update && apt-get upgrade --yes && apt-get install --yes apt-utils \
        && DEBIAN_FRONTEND=noninteractive apt-get install --yes postfix \
        && apt-get install --yes nodejs \
        && apt-get install --yes npm \
        && apt-get install --yes cron

COPY . /datastringer/
COPY wizard /datastringer/wizard

WORKDIR "/datastringer"

RUN npm install

RUN (crontab -l ; echo "0 12 * * * nodejs /datastringer/datastringer.js") 2>&1 | sed "s/no crontab for $(whoami)//" | sort | uniq | crontab -

EXPOSE 3000

CMD [ "nodejs", "wizard.js" ]

