/**
 * @brief makeDataSource builds a DataSource object
 * @param name the name of the DataSource object.
 * @param description a description of the data source. Can be formatted using
 * MarkDown.
 *
 * @param hasNewDataSince the function to call to check if there new data since
 * the given data. Must take one param of type Date and return true or false.
 *
 * @param getData fetch and return data frames over a range of time. Must take two
 * parameters of type Date. The first is the starting point of the time range
 * and the second the ending point. Returns as much data frames as there is
 * between the two dates.
 */
function makeDataSource(
  name,
  description,
  hasNewDataSince,
  getData) {

  var dataSource = {
    name: name,
    description: description,

    hasNewDataSince: hasNewDataSince,
    getData: getData
  };

  return dataSource;
}

module.exports.makeDataSource = makeDataSource;

