FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone https://github.com/BBC-News-Labs/datastringer.git
RUN sudo ln -s /usr/bin/nodejs /usr/bin/node
RUN cd /datastringer && bash /datastringer/install.sh
EXPOSE 3000
CMD node /datastringer/wizard.js
