'use strict';

function fromObject(configObject){
  var keys = Object.keys(configObject);
  var stringers = [];

  keys.forEach(function(configKey){
    try {
      stringers.push(require.resolve(configKey + '-stringer'));
    }
    catch(e){}
  });

  return stringers;
}

module.exports = {
  fromObject: fromObject
};