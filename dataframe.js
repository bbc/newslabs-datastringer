/**
 * @brief makeDataFrame makes a DataFrame object.
 * @param date the Date object to which the data is associated.
 * @param data the actual data.
 *
 * A data frame is the association of a Date object and some data. This data is
 * completly arbitrary and can range from a simple integer to a complex object.
 * Knowing the emitter of the data frame, one is able to know what the data
 * field actually holds, and use it accordingly.
 */

function makeDataFrame(date, data) {
  var result = {
    date: date,
    data: data
  };

  return result;
}

module.exports.makeDataFrame = makeDataFrame;
