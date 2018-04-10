const dbToJson = async (db) => {
    const cwd = require('cwd');
    const utils = require(cwd('utils'));
    const fs = require('fs');
    var util = require('util');
    const runArguments = {}

    process.argv.map((arg) => {
        const argBroken = arg.split('=');

        if (arg === '--get-last') {
            runArguments.getLast = true;
        } else if (
            argBroken[0] === '--scrape-options'
            && typeof argBroken[1] === 'string'
        ) {
            runArguments.scrapeId = argBroken[1];
        }
    });

    console.log('Getting data from database.')
    const scrapeOptions = await utils.database.getInputRange(
        db,
        { ...runArguments }
    );

    console.log('scrapeOptions: ', scrapeOptions);
    try {
        fs.writeFileSync(
            cwd(`output/db-to-json/scrapeOptions_${new Date().getTime()}.json`),
            JSON.stringify(scrapeOptions, null, 2)
        );
    } catch (err) {
        console.error('Error: Cannot write scrapeOptions to file: ', err);
    }
    
    // save to files
    console.log('Finished.')
}

module.exports = dbToJson;
