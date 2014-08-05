/**
 * @param name name of the output.
 * @param description a nice description of the output.
 * @param sources an array containing the names of the datasources used by this
 * output.
 * @param check the function called to check wether or not the output should be
 * triggered. Take as parameter one array of datasources, who must at least
 * contains the datasources whose names are in the 'sources' attribute of the
 * output.
 */
function makeOutput(
  name,
  description,
  sources,
  check) {

  var output = {
    name: name,
    description: description,
    sources: sources,

    check: check
  };

  return output;
}

module.exports.makeOutput = makeOutput;
