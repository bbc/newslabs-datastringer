var DS = require('./datasource.js')

module.exports.dataSource = DS.makeDataSource(
  'police-uk',
  'Some crime stats',
  function hasNewsSince(date) {
    var treshold = new Date('2014-05-01');
    return date > treshold;
  },
  function getData(from, to) {
    console.log(from + ' : ' + to);
  }
);

