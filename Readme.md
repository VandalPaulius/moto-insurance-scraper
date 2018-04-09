# GoCompare motorcycle insurance scraper #

## HOW TO (main) ##

* Get a quote for a motorcycle at gocompare.com
* Register with the password
* Provide .env file with login details
* `npm install`
* `npm start`

### HOW TO: setup .env file (example) ###

```text
URL_TO_SCRAPE=http://www.gocompare.com
GO_COMPARE_USERNAME=myawesomeunblockablemail@gmail.com
GO_COMPARE_PASSWORD=passwordIDONTCAREabout
GO_COMPARE_DOB=1989-6-9
APPLICATION_MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=INSURANCE_PRICE_SCRAPER
OPTIONS_SCRAPE_RETRIES=5
```

### HOW TO: scrape (main) ###

1. You need to scrape options
2. Need to create JSON files with desired input ranges (NOT IMPLEMENTED YET)
3. Feed files to quote scraper (NOT IMPLEMENTED YET)

### HOW TO: scrape options ###

1. Install MongoDb
2. Edit `[root]/mongo_db/start_mongodb.bat` file with desired database location
3. Run `npm install`
4. run `npm run scrape-options` to scrape option data to database
