const getRunArguments = () => {
    const runArguments = {}

    process.argv.map((arg) => {
        const argBroken = arg.split('=');

        if (arg === '--get-last') {
            runArguments.getLast = true;
        } else if (
            argBroken[0] === '--batch-id'
            && typeof argBroken[1] === 'string'
        ) {
            runArguments.batchId = argBroken[1];
        }
    });

    return runArguments;
}

const scrapeQuotes = async (db, headless = false) => {
    const cwd = require('cwd');
    const scraper = require(cwd('scraper'));
    const utils = require(cwd('utils'));
    const puppeteer = require('puppeteer');

    const runArguments = getRunArguments();

    const scrapeIds = await utils.database.getScrapeIds(
        db,
        {
            batchId: runArguments.batchId,
            getLast: runArguments.getLast
        }
    )

    console.log('')
}

module.exports = scrapeQuotes;
