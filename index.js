require('dotenv').config()
const utils = require('./utils');
const main = require('./main');

const distributor = async () => {
    const db = await utils.database.initDb();

    if (!db) {
        console.log('Cannot run without database.');
        return;
    }

    const launchArguments = {}
    process.argv.map((arg) => {
        switch (arg) {
            case '--scrape-options': {
                launchArguments.scrapeOptions = true;
                break;
            }
            case '--db-to-json': {
                launchArguments.dbToJson = true;
                break;
            }
            case '--generate-input-range': {
                launchArguments.generateInputRange = true;
                break;
            }
            case '--scrape-quotes': {
                launchArguments.scrapeQuotes = true;
                break;
            }
            case '--headless=false': {
                launchArguments.headless = false;
            }
        }
    });

    if (launchArguments.scrapeOptions) {
        await main.scrapeOptions(db, launchArguments.headless);
    } else if (launchArguments.scrapeOptions) {
        await main.dbToJson(db, launchArguments.headless);
    } else if (launchArguments.scrapeOptions) {
        await main.generateInputRange(db, launchArguments.headless);
    } else if (launchArguments.scrapeOptions) {
        await main.scrapeOptions(db, launchArguments.headless);
    }

    console.log('Exiting gracefully.');
    process.exit(0);
    return;
};

distributor();
