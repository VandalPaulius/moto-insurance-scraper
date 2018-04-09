## GoCompare motorcycle insurance scraper ##

# How to:
* Get a quote for a motorcycle at gocompare.com
* Register with the password
* Provide .env file with login details
* `npm install`
* `npm start`


# .env file example:

```text
URL_TO_SCRAPE=http://www.gocompare.com
GO_COMPARE_USERNAME=myawesomeunblockablemail@gmail.com
GO_COMPARE_PASSWORD=passwordIDONTCAREabout
GO_COMPARE_DOB=1989-6-9
APPLICATION_MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=INSURANCE_PRICE_SCRAPER
OPTIONS_SCRAPE_RETRIES=5
```