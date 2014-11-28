'use strict';

function fromObject(configObject){
  var keys = Object.keys(configObject);
  var stringers = [];

  keys.forEach(function(configKey){
    try {
      var stringerName = configKey + '-stringer';

      // will fail if the module does not exist
      require.resolve(stringerName);
      stringers.push(configKey);
    }
    catch(e){}
  });

  return stringers;
}

function loadStringer(stringerName, config){
  return require(stringerName + '-stringer');//(config || {});
}

module.exports = {
  fromObject: fromObject,
  load: loadStringer
};