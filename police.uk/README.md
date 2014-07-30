#Police.uk

This is the first source we're going to use. 
Classic API, returns very simple and clear JSON.

##Todo
- Run some stats analysis on the data-props so we know which story we would be pursuing
- From there, list the criteria we will give to the datastringer

###Local stories about police forces

- ``GET data.police.uk/api/forces/leicestershire/people`` lists senior officers. I'd like to be notified when there's a change in the team.

- ``GET data.police.uk/api/metropolitan/00AEGW/people`` same thing.

- ``GET data.police.uk/api/leicestershire/C01/events`` same thing, but with events.

- ``GET data.police.uk/api/metropolitan/00AEGW/priorities`` for priorities.

Combining these four queries would hopefully create a nice and very basic set of news for a local journo to find some pegs in.

###Crime statistics

Then, another set of queries about street-level crime and outcomes. Several methods are available in the Postman collection, and we need to think about how to make them interact. 
The idea being less to produce simple alerts, but to actually harvest numbers from the API and to do our own stats with them, in order to generate second-level alerts (we are not notified about a *change in the dataset itself*, but about a *change in a trend caused by the latest numbers.*

- ``GET data.police.uk/api/crimes-street/all-crime?lat=51.5749601&lng=-0.1544628&date=2014-05`` is the street-level crime, and a good start to run some stats.

- ``GET data.police.uk/api/crimes-street/outcomes-at-location?lat=51.5749601&lng=-0.1544628&date=2014-05`` idem for the outcomes at location.

Apparently, the best way to get a timestamp of the last updated data is to run ``http://data.police.uk/api/crime-last-updated``.
