#What we want from the Datastringer

##Source 1: Crime statistics in my region

* Source: Police.uk Rest API
* User input: GPS location (clickable map)

**What I want:**

* A list of the number of crimes this month, sorted by category
(*i.e. anti-social behaviour: 420, bicycle theft: 70...*) ;
* An idea of how these numbers progressed in regard to a 6-month average

**Alert me when:** a type of crime goes +/- 10% in regard to its 6-month average.
That means there's a story to write, as the number is significant enough (though arbitrary in this case) to qualify something important happening in my neighbourhood about the way crime is developing and/or the local police force is dealing with crime.

*Note: I might want to monitor several GPS location, or a polygon.*

##Source 2: Local police news

* Source: Police.uk Rest API
* User input: GPS location - that will expose my neighbourhood's code

**What I want:**

* To have some news about what's happening in my local force

**Alert me when:** new priorities are set, the team changes, or new events are planned. Because my grandma loves to know that this local police officer is up to - she knows all of them, you know.

*Note: I might want to monitor several neighbourhoods.*

