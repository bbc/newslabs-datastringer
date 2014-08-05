/**
 * @brief makeDataSourceManager builds a DataSourceManager object.
 * @param JSONData the JSON string holding the DataSource objects to be parsed.
 */
function makeDataSourceManager() {

  var dataSourcesDict = {};

  var manager = {
    /**
     * @brief dataSources return the dataSources object. Each datasource is
     * stored as value, and has for key its name.
     */
    dataSources: function() {
      return dataSourcesDict;
    },

    /**
     * @brief addDataSource adds a data source to the managed sources.
     * @param ds the DataSourceObject to add. If the data source was already
     * managed, it will be overwritten.
     * TODO could add a param to choose between overwriting or fail when trying
     * to add a source whose name is already present.
     */
    addDataSource: function(ds) {
      dataSourcesDict[ds.name] = ds;
    },

    /**
     * @brief removeDataSource removes a data source from the managed list.
     * @param dsIndex the index of the DataSource to remove in the managed list.
     * @return true if the removal was successful, false otherwise.
     * The removal can fail if the index is out of bounds wrt the data sources
     * list.
     */
    removeDataSource: function(dsIndex) {
      if (dsIndex in dataSourcesArray) {
        dataSourcesArray.splice(dsIndex, 1);
        return true;
      }
      return false;
    }

    /**
     * @brief loadFromJSON load the data sources from a given JSON string and
     * populate the datasource dict.
     * @param JSONString the JSON
     */
    loadFromJSON: function(JSONString) {
      dataSourcesDict = {};

      var parsedJSON = JSON.parse(JSONString);
      for (var i = 0; i < parsedJSON.length; i++) {
        this.addDataSource(require(parsedJSON[i]).dataSource);
      }
    },

    /**
     * @brief exportToJSON exports the current managed list to a JSON string
     * @return the JSON string encoding the data sources.
     */
    exportToJSON: function() {
      return jsonfn.stringify(dataSourcesArray);
    }
  };

  return manager;
}

module.exports.makeDataSourceManager = makeDataSourceManager;
