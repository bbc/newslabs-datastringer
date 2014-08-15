![logo](https://raw.githubusercontent.com/basilesimon/datastringer/master/logo-comp.png)

#Data-stringer

###Was ist das?
**Data stringer:** the exact equivalent of wire agencies' (AFP/AP/Reuters) local journalists who feed the organisation with news (called *wires*).
Except that here, that's a software living in a dataset, not in Iran, that's going to do the job.

#Installation, configuration

Getting started with Datastringer is easy:

##Installation

Just clone the repo and run the installation script located at root. You only
have to do that once.

```
$ git clone http://github.com/basilesimon/datastringer.git && cd datastringer
$ ./install.sh
```

##Configuration

`node app.js` will start a small web server. Connect to it with your favorite
web browser (the URL is shown in the console) to access the configuration GUI.

When you are done with configuration, you can stop the server by `CTRL-C`ing it.

If you wish to change your configuration later, just start it again.

##*Voilà!*

You just set up your first datastringers, and you will be notified when these example alerts are triggered.
[Here is what these examples do](https://github.com/basilesimon/datastringer/blob/master/what-we-want.md)

#Do more with Datastringer

Datastringer is built on Javascript and Node.js, making it super easy to configure, run, and customise.
[Refer to the documentation](https://github.com/basilesimon/datastringer/wiki) to understand the architecture, rummage the examples and... build your own stringer!

##About the license

Datastringer is distributed under the MIT License, and developed by [Basile Simon](http://twitter.com/basilesimon), [Clément Geiger](http://twitter.com/5c2v), for [BBC News Labs](http://twitter.com/bbc_news_labs). [Read more about the MIT License](https://tldrlegal.com/license/mit-license).
