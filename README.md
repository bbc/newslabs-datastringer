![logo](https://raw.githubusercontent.com/BBC-News-Labs/datastringer/master/logo-comp.png)

#Data-stringer

**NOTE: Datastringer is still under heavy development.** Please [check out the releases and changelog](https://github.com/BBC-News-Labs/datastringer/releases)

Works on Ubuntu-based OS only. [See the issue for installing on Mac OS](https://github.com/BBC-News-Labs/datastringer/issues/9)


###Was ist das?
**Data stringer:** the exact equivalent of wire agencies' (AFP/AP/Reuters) local journalists who feed the organisation with news (called *wires*).
Except that here, that's a software living in a dataset, not in Iran, that's going to do the job.

#Installation, configuration

Getting started with Datastringer is easy:

##Installation

Just clone the repo and run the installation script located at its root. You only
have to do this once.

```
$ git clone http://github.com/BBC-News-Labs/datastringer.git && cd datastringer
$ ./install.sh
```

`install.sh` will take of installing the needed dependencies:
* node
* npm
* postifx (needed to be able to send mail)

It will then proceed to fetch node modules dependencies.

The install script has been written and tested on Linux Ubuntu 14.04.

##Introduction tour

`node wizard.js` will start a small web server. Point towards
[localhost:3000](localhost:3000) with your favourite web browser.

When you are done with the configuration, you can stop the server by `CTRL-C`ing it.

##*Voilà!*

You just set up your first datastringers with two basic examples. You will be
notified by email when alerts are triggered!
[Here is what these examples do.](https://github.com/BBC-News-Labs/datastringer/blob/master/what-we-want.md)

#Do more with Datastringer

Datastringer is built on Javascript and Node.js, and we make sure it won't be
hard for you to extend it.
[Refer to the documentation](https://github.com/BBC-News-Labs/datastringer/wiki)
to understand the architecture, rummage the examples and... build your own
stringers!

#Contributing
Before submitting pull-requests, please refer to [the road-map](https://github.com/BBC-News-Labs/datastringer/wiki/Roadmap). 

##About the license

Datastringer is distributed under the MIT License, and developed by [Basile Simon](http://github.com/basilesimon), [Clément Geiger](http://github.com/Cgg), for [BBC News Labs](http://twitter.com/bbc_news_labs). [Read more about the MIT License](https://tldrlegal.com/license/mit-license).
