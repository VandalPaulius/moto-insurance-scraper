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
4. Run `npm run scrape-options` to scrape option data to database

### HOW TO: save options to json file ###

1. Do 'HOW TO: scrape options` step
2. **If you only need last options scrape data skip this step.**
    1. Open database with `Mongobooster` or similar `MongoDb` viewing tool
    2. Open `SCRAPE_OPTIONS` collection
    3. Locate and copy desired record `_id`
3. Run `npm run db-to-json --get-last` **or** `npm run db-to-json --scrape-options=YOUR_CHOSEN_RECORD_ID` to get scrape option data from database

### HOW TO: generate input ranges from json file ###

1. Do 'HOW TO: save options to json file` step
2. Copy latest file from `[root]/output/db-to-json/scrapeOptions_[timestamp].json` to `[root]/input/inputRange.json`
3. Edit `inputRange.json` with desired input values (delete unnecessary). **Keep in mind, that even small option lists can generate huge combinations**
4. Run `npm run generate-input-range` to generate and save input ranges to database