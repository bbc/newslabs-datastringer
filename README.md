#Data-stringer

###Was ist das?
**Data stringer:** the exact equivalent of wire agencies' (AFP/AP/Reuters) local journalists who feed the organisation with news (called *wires*).
Except that here, that's a software living in a dataset, not in Iran, that's going to do the job.

###First job: gathering data sources
We will select three different data sources. Ideally, they will return data in three different formats, and will ask for three different methods to harvest and exploit the data.

* Police.uk REST API: JSON - [link](https://github.com/basilesimon/datastringer/tree/master/police.uk)

* Gov.uk RSS feeds: Atom - [link](https://github.com/basilesimon/datastringer/tree/master/gov.uk)


###Stuffstatus

####DataSource

That's an object describing a data source (i.e. input) for datastringer.

#####Attributes

- `name`: a string used to identify the source. Should be unique and yet
human-readable (e.g. polic.uk.crime.stats.London)
- `description`: a string describing the source. For documentation purpose

#####Methods

- `hasNewDataSince(date)`: return true if there is some new data since `date`,
false otherwise.
- `getData(from, to)`: returns an array of DataFrames ranging from 'from' to 'to',
which are dates. Obviously, 'from' must be inferior to 'to'. 'to' can be omitted,
in which case getData will return all the data from 'from' to the present time.


####DataFrame

That's an object representing a data point in time. It has two attributes.

- `date`: the date of the data.
- `data`: the data itself. It is stored as a string. The real underlying format
(JSON, XML, just a number, just plain text...) is dependent on the source
outputting the DataFrame.


####Output

The output object represent one output of datastringer. Thus it combines
data from several inputs (DataSource objects) and has some intelligence to know
wether it should trigger itself based on what comes in.

#####Attributes

- `name`: a string used to identify the output. Should be unique and yet
human-readable (e.g. bike.theft.burst.London)
- `dataSourceInputs`: a list of strings, the names of the data sources used
by the output. The names in this list typically are the `name` attributes of
the `DataSource` used by the Output.

#####Methods

- check(): this method will use the datasources to check if there is a reason
to trigger the output (generate a peg).


####Putting it all together

#####Getting data, triggering outputs

There should be a 'core' object or file containing a routine that will be
launched at regular interval (say, every two days) by a CRON job. This routine
essentially checks every data source for novelty, and based on which has news
then call the `check()` method on the relevant outputs.

Please bear with me and my horrible pseudo-code.


```
function checkDataSources() {
  news = []

  forEach ds in dataSources() {
    if ds.hasNewDataSince(lastUpdateDate) {
      news << ds.name
    }
  }

  checkOutputs(news)
}

function checkOutputs(newsList) {
  outputsToCheck = []

  forEach ds in newsList {
    forEach o in outputs() {
      if o.sources.contains(ds) && not outputsToCheck.contains(o) {
        outputsToCheck << o
      }
    }
  }

  forEach o in outputsToCheck {
    o.check();
  }
}
```

#####Storing DataSource and Output descriptions

DataSource and Output can be serialized from and to JSON. One file can hold the
sources and another one the outputs, or one file could do both. Either ways,
the location of the file(s) is written in the configuration file and has a
sensible default value (e.g. ~/.local/share/datastringer.rc)
