FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y git nodejs npm supervisor postfix
RUN git clone https://github.com/BBC-News-Labs/datastringer.git
RUN sudo ln -s /usr/bin/nodejs /usr/bin/node
RUN cd /datastringer && bash /datastringer/install.sh
ADD cron-supervisor.conf /etc/supervisor/conf.d/cron.conf
ADD node-supervisor.conf /etc/supervisor/conf.d/node.conf
ADD postfix-supervisor.conf /etc/supervisor/conf.d/postfix.conf
EXPOSE 3000
CMD supervisord -n
