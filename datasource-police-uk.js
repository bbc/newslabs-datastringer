var DS = require('./datasource.js')

module.exports.dataSource = DS.makeDataSource(
  'police-uk', // name

  'Some crime stats', // description

  function hasNewsSince(date) {
    var treshold = new Date('2014-05-01');
    return date > treshold;
  },

  function getData(from, to) {
    console.log(from + ' : ' + to);
  }
);

