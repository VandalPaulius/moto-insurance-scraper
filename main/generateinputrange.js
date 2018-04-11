const uuidv1 = require('uuid/v1');
const cwd = require('cwd');
const utils = require(cwd('utils'));

const flatten = (scrapeOptions, name) => {
    let flatOptions = {};

    Object.keys(scrapeOptions).map((optionKey) => {
        if (typeof scrapeOptions[optionKey] === 'object' && !(scrapeOptions[optionKey] instanceof Array)) { // are you an object?
            const flatObj = flatten(scrapeOptions[optionKey], `${name}_${optionKey}`);
            flatOptions = {
                ...flatOptions,
                ...flatObj
            }
        } else {
            flatOptions[`${name}_${optionKey}`] = scrapeOptions[optionKey];
        }
    })

    return flatOptions;
}

const generateRanges = (givenOptions) => {
    let options = {};

    Object.keys(givenOptions).map((optionKey) => {
        if (typeof givenOptions[optionKey] === 'object'
            && !(givenOptions[optionKey] instanceof Array)
        ) {
            if (givenOptions[optionKey].from && givenOptions[optionKey].to) {
                options = {
                    ...options,
                    [optionKey]: utils.helpers.getNumberList(
                        givenOptions[optionKey].from,
                        givenOptions[optionKey].to
                    )
                }
            } else {
                options = {
                    ...options,
                    [optionKey]: generateRanges(givenOptions[optionKey])
                }
            }
        } else {
            options[optionKey] = givenOptions[optionKey];
        }
    })

    return options;
}

const getCombinations = (options, optionIndex, results, current) => { // credits to Dmytro Shevchenko @ StackOverflow
    const allKeys = Object.keys(options);
    const optionKey = allKeys[optionIndex];
    let vals = options[optionKey];

    if (!(vals instanceof Array)) { // check for oddities
        vals = [ vals ];
    }

    for (let i = 0; i < vals.length; i++) {
        current[optionKey] = vals[i];

        if (optionIndex + 1 < allKeys.length) {
            getCombinations(options, optionIndex + 1, results, current);
        } else {
            const res = JSON.parse(JSON.stringify(current)); // object deep copy
            results.push(res);
        }
    }

    return results;
}

const generate = async ({
    db,
    scrapeOptions
}) => {

    let outputOptions = [];
    let scrapeOptionsInternal = JSON.parse(JSON.stringify(scrapeOptions)); // deep copy

    const scrapeOptionsGenerated = generateRanges(scrapeOptions);
    const flatScrapeOptionsObj = flatten(scrapeOptionsGenerated, '');

    const combinations = getCombinations(flatScrapeOptionsObj, 0, [], {});
    // combinations quality control [start]
    const combinationsNoDuplicates = utils.helpers
        .removeArrayDuplicates(combinations);
    const combinationsSizeControl = combinationsNoDuplicates.filter((option) => {
        if (Object.keys(option).length === 76) {
            return option
        }
    })
    // combinations quality control [end]
    
    return combinations;
}

const generateInputRange = async (db) => {
    const cwd = require('cwd');

    let scrapeOptions;
    let error;
    try {
        console.log('Getting data from [root]/input/inputRange.json.')
        scrapeOptions = require(cwd('input/inputRange.json'));        
    } catch (err) {
        error = err;
    }

    if (!scrapeOptions || error) {
        console.error(`Cannot get data.${error ? ` Error: ${error}`: ''}`)
    } else {
        await generate({
            db,
            scrapeOptions
        });
    }
}

module.exports = generateInputRange;
