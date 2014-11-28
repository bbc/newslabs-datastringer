'use strict';

var cacheClient = require("cache-client");
var redisuri = require('redisuri');
var axios = require('axios');

module.exports = function(config){
  var REDIS_URL = process.env.REDIS_URL || process.env.REDISTOGO_URL || process.env.REDISCLOUD_URL;

  if (REDIS_URL) {
    var redisConfig = redisuri.parse(REDIS_URL);
    cacheClient.setup({
      store: "redis",
      port: redisConfig.port,
      host: redisConfig.host,
      auth: redisConfig.auth,
      opts:{}
    });
  }
  else {
    cacheClient.setup({store: "memory", opts:{}});
  }

  return Object.freeze({
    http: axios,
    cache: cacheClient
  });
};