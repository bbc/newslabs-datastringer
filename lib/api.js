'use strict';

var cacheClient = require("cache-client");
var axios = require('axios');

module.exports = function(config){
  return Object.freeze({
    http: axios,
    cache: cacheClient.setup({store: "memory", opts:{}})
  });
};