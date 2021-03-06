const uuidv4 = require('uuid/v4');
const cwd = require('cwd');
const utils = require(cwd('utils'));
const PromiseQueue = require('promise-queue');

const flatten = (scrapeOptions, name) => {
    let flatOptions = {};

    Object
        .keys(scrapeOptions)
        .map((optionKey) => {
            if (typeof scrapeOptions[optionKey] === 'object' && !(scrapeOptions[optionKey]instanceof Array)) { // are you an object?
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

    Object
        .keys(givenOptions)
        .map((optionKey) => {
            if (typeof givenOptions[optionKey] === 'object' && !(givenOptions[optionKey]instanceof Array)) {
                if (givenOptions[optionKey].from && givenOptions[optionKey].to) {
                    options = {
                        ...options,
                        [optionKey]: utils
                            .helpers
                            .getNumberList(givenOptions[optionKey].from, givenOptions[optionKey].to)
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

const saveInputRangeToDb = async({batchId, db, inputRange, scrapeId}) => {
    await utils
        .database
        .saveToDb(db, {
            type: 'generateInputSaveInputRange',
            data: {
                batchId,
                inputRange,
                scrapeId
            }
        });
}

const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

const mergeDeep = (target, ...sources) => { // credits Salakar @ StackOverflow
    if (!sources.length) 
        return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) 
                    Object.assign(target, {[key]: {}});
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
}

const mapToObject = (inputRangeRaw) => {
    const objectArr = []
    let inputRange = {};

    const toObj = ({index, keys, keyRaw}) => {
        if (index + 1 === keys.length) {
            return {
                [keys[index]]: inputRangeRaw[keyRaw]
            }
        }
        return {
            [keys[index]]: toObj({
                index: index + 1,
                keys,
                keyRaw
            })
        }
    }

    Object
        .keys(inputRangeRaw)
        .map((keyRaw) => {
            const keyParts = keyRaw
                .split('_')
                .filter((key, index) => {
                    if (index) {
                        return key;
                    }
                });

            objectArr.push(toObj({index: 0, keys: keyParts, keyRaw}))
        });

    objectArr.map((inputRangeBit, index) => {
        inputRange = mergeDeep(inputRange, inputRangeBit);
    })

    return inputRange;
}

const generateCombinations = ({
    options,
    optionIndex,
    resultCount,
    current,
    results,
    batchId,
    db,
    promiseQueue
}) => { // credits to Dmytro Shevchenko @ StackOverflow
    const allKeys = Object.keys(options);
    const optionKey = allKeys[optionIndex];
    let vals = options[optionKey];

    if (!(vals instanceof Array)) { // check for oddities
        vals = [vals];
    }

    for (let i = 0; i < vals.length; i++) {
        current[optionKey] = vals[i];

        if (optionIndex + 1 < allKeys.length) {
            generateCombinations({
                options,
                optionIndex: optionIndex + 1,
                resultCount,
                current,
                results,
                batchId,
                db,
                promiseQueue
            });
        } else {
            const inputRangeRaw = JSON.parse(JSON.stringify(current)); // object deep copy
            const inputRange = mapToObject(inputRangeRaw);
            const scrapeId = uuidv4();

            // add to Promise queue to prevent premature process close
            promiseQueue.add(() => saveInputRangeToDb({batchId, db, inputRange, scrapeId}));

            resultCount.push('sucess');

            if (results) {
                results.push(inputRange);
            }
        }
    }

    if (results) {
        return {results, resultCount}
    } else {
        return resultCount;
    }
}

const generate = async({db, scrapeOptions, batchId, promiseQueue}) => {

    let outputOptions = [];
    let scrapeOptionsInternal = JSON.parse(JSON.stringify(scrapeOptions)); // deep copy

    const scrapeOptionsGenerated = generateRanges(scrapeOptions);
    const flatScrapeOptionsObj = flatten(scrapeOptionsGenerated, '');
    let resultCountArr = [];

    try {
        await generateCombinations({
            options: flatScrapeOptionsObj,
            optionIndex: 0,
            results: null,
            resultCount: resultCountArr,
            current: {},
            batchId,
            db,
            promiseQueue // add
        });
        // // combinations quality control [start] const combinationsNoDuplicates =
        // utils.helpers     .removeArrayDuplicates(combinations); const
        // combinationsSizeControl = combinationsNoDuplicates.filter((option) => {
        // if (Object.keys(option).length === Object.keys(flatScrapeOptionsObj).length)
        // {         return option     } }) // combinations quality control [end]
    } catch (err) {
        return false;
    }

    return resultCountArr.length;
}

const generateInputRange = async(db) => {
    const cwd = require('cwd');
    const promiseQueue = new PromiseQueue(Infinity, Infinity);
    const batchId = uuidv4();

    let scrapeOptions;
    let error;
    let batchSize;
    try {
        console.log('Getting data from [root]/input/inputRange.json.')
        scrapeOptions = require(cwd('input/inputRange.json'));
    } catch (err) {
        error = err;
    }

    if (!scrapeOptions || error) {
        console.error(`Cannot get data.${error
            ? ` Error: ${error}`
            : ''}`)
    } else {

        await utils
            .database
            .saveToDb(db, {
                type: 'generateInputRangeStarted',
                data: {
                    batchId,
                    startedAt: new Date()
                }
            });

        batchSize = await generate({db, scrapeOptions, batchId, promiseQueue});

        if (!batchSize) {
            console.error(`Finished unsuccessfully.`)
            return;
        }
    }

    do {} while (promiseQueue.getPendingLength() > 1 && promiseQueue.getQueueLength() > 1);

    await utils
        .database
        .saveToDb(db, {
            type: 'generateInputRangeFinished',
            data: {
                batchId,
                finishedAt: new Date(),
                batchSize
            }
        });

    console.log('Finished successfully');
}

module.exports = generateInputRange;
