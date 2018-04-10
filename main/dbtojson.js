const dbToJson = async (db) => {
    const cwd = require('cwd');
    const utils = require(cwd('utils'));
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
    // save to files
    console.log('Finished.')
}

module.exports = dbToJson;
