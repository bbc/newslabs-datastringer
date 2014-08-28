FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone http://github.com/BBC-News-Labs/datastringer.git
RUN cd /datastringer && bash /datastringer/install.sh
RUN sudo ln -s /usr/bin/nodejs /usr/bin/node
EXPOSE 3000
CMD node /datastringer/wizard.js
