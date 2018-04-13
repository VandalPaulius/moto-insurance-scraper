let database = {};

const initDb = async() => {
    // legacy start
    database = {
        scrapeOptions: {}
    }
    // legacy end

    const mongoClient = require('mongodb').MongoClient;
    let client;
    let db;

    try {
        client = await mongoClient.connect(process.env.APPLICATION_MONGODB_URL);

        db = client.db(process.env.MONGODB_NAME);
    } catch (err) {
        console.error(err);
    }

    await db.createCollection('SCRAPE_OPTIONS');
    await db.createCollection('BATCHES');
    await db.createCollection('SCRAPES');

    return db;
}

const getDb = () => {
    return database;
}

const getScrapeOptionsInputRange = async (
    db, {
        scrapeId,
        getLast
    }
) => {
    if (scrapeId) {
        const scrapeOptionsFromDb = await db
            .collection('SCRAPE_OPTIONS')
            .find({ _id: scrapeId })
            .project({ _id: 0, scrapeOptions: 1 })
            .toArray();

        const scrapeOptions = scrapeOptionsFromDb[0].scrapeOptions
            ? scrapeOptionsFromDb[0].scrapeOptions
            : {};

        return scrapeOptions;
    } else {
        const scrapeOptionsFromDb = await db
            .collection('SCRAPE_OPTIONS')
            .find({})
            .sort({ startedAt: -1 })
            .limit(1)
            .project({ _id: 0, scrapeOptions: 1 })
            .toArray();

        const scrapeOptions = scrapeOptionsFromDb[0].scrapeOptions
            ? scrapeOptionsFromDb[0].scrapeOptions
            : {};

        return scrapeOptions;
    }
}

const getInputRange = async ({
    db,
    scrapeId
}) => {
    const inputRangeContainer = await db
        .collection('SCRAPES')
        .find({ _id: scrapeId })
        .project({ _id: 0, inputRange: 1 })
        .toArray();

    return inputRangeContainer[0].inputRange;
}

const getScrapeIds = async (
    db,
    {
        batchId,
        getLast
    }
) => {
    if (batchId) {
        const scrapeIds = await db
            .collection('SCRAPES')
            .find({ batchId })
            .project({ _id: 1 })
            .toArray();

        return scrapeIds.map(container => container._id);
    } else {
        const lastBatchId = await db
            .collection('BATCHES')
            .find({})
            .sort({ startedAt: -1 })
            .limit(1)
            .project({ _id: 1 })
            .toArray();

        const scrapeIds = await db
            .collection('SCRAPES')
            .find({ batchId: lastBatchId[0]._id })
            .project({ _id: 1 })
            .toArray();

        return scrapeIds.map(container => container._id);
    }
}

const dbReducer = async (db, {type, data}) => {
    switch (type) {
        case 'scrapeOptionsSaveStartedDate':
            {
                await db
                    .collection('SCRAPE_OPTIONS')
                    .save({_id: data.scrapeId, startedAt: data.startedAt});

                break;
            }
        case 'scrapeOptionsSaveEndedDate':
            {
                await db
                    .collection('SCRAPE_OPTIONS')
                    .update({
                        _id: data.scrapeId
                    }, {
                        $set: {
                            finishedAt: data.finishedAt
                        }
                    });

                break;
            }
        case 'scrapeOptionsInputRange':
            {
                const inputRangeFromDb = await db
                    .collection('SCRAPE_OPTIONS')
                    .find({_id: data.scrapeId})
                    .project({_id: 0, inputRange: 1})
                    .toArray();

                let inputRangeUpdated = inputRangeFromDb[0]
                    ? inputRangeFromDb[0]
                    : {};

                inputRangeUpdated = {
                    ...inputRangeUpdated,
                    ...data.inputRange
                }

                await db
                    .collection('SCRAPE_OPTIONS')
                    .update({
                        _id: data.scrapeId
                    }, {
                        $set: {
                            inputRange: inputRangeUpdated
                        }
                    });

                break;
            }
        case 'scrapeOptions':
            {
                const dbScrapeOptions = await db
                    .collection('SCRAPE_OPTIONS')
                    .find({_id: data.scrapeId})
                    .project({_id: 0, scrapeOptions: 1})
                    .toArray();

                let scrapeOptionsFilled = dbScrapeOptions[0]
                    && dbScrapeOptions[0].scrapeOptions
                    ? dbScrapeOptions[0].scrapeOptions
                    : {};

                scrapeOptionsFilled = {
                    ...scrapeOptionsFilled,
                    [data.name]: data.options
                }

                await db
                    .collection('SCRAPE_OPTIONS')
                    .update({
                        _id: data.scrapeId
                    }, {
                        $set: {
                            scrapeOptions: scrapeOptionsFilled
                        }
                    });

                break;
            }
            case 'generateInputRangeStarted':
            {
                await db
                    .collection('BATCHES')
                    .save({
                        _id: data.batchId,
                        startedAt: data.startedAt
                    });

                break;
            }
            case 'generateInputRangeFinished':
            {
                await db
                    .collection('BATCHES')
                    .update({
                        _id: data.batchId
                    }, {
                        $set: {
                            finishedAt: data.finishedAt,
                            batchSize: data.batchSize
                        }
                    });

                break;
            }
            case 'generateInputSaveInputRange':
            {
                await db
                    .collection('SCRAPES')
                    .save({
                        _id: data.scrapeId,
                        batchId: data.batchId,
                        inputRange: data.inputRange
                    });

                break;
            }
            case 'quotes':
            {
                return {
                    ...db,
                    [data.scrapeId]: {
                        ...db[data.scrapeId],
                        quotes: data.quotes
                    }
                };
            }
        case 'SCRAPE_QUOTES__GET_LAST__BATCH_ID':
            {
                await db
                    .collection('BATCHES')
                    .update({
                        _id: data.batchId
                    }, {
                        $set: {
                            finishedAt: data.finishedAt,
                            batchSize: data.batchSize
                        }
                    });

                break;
            }
        case 'SCRAPE_QUOTES__SAVE_STARTED_DATE':
            {
                await db
                    .collection('SCRAPES')
                    .update({
                        _id: data.scrapeId
                    }, {
                        $set: {
                            startedAt: data.startedAt
                        }
                    });

                break;
            }
        case 'SCRAPE_QUOTES__SAVE_FINISHED_DATE':
            {
                await db
                    .collection('SCRAPES')
                    .update({
                        _id: data.scrapeId
                    }, {
                        $set: {
                            finishedAt: data.finishedAt
                        }
                    });

                break;
            }
        case 'SCRAPE_QUOTES__SAVE_QUOTES':
            {
                await db
                    .collection('SCRAPES')
                    .update({
                        _id: data.scrapeId
                    }, {
                        $set: {
                            quotes: data.quotes
                        }
                    });

                break;
            }
        case 'input':
            {
                return {
                    ...db,
                    [data.scrapeId]: {
                        ...db[data.scrapeId],
                        input: {
                            ...db[data.scrapeId].input,
                            [data.inputName]: {
                                value: data.value,
                                page: data.page,
                                type: data.type
                            }
                        }
                    }
                };
            }
        case 'inputRange':
            {
                let inputRange;

                if (db[data.scrapeId]) {
                    inputRange = {
                        ...db[data.scrapeId].inputRange,
                        ...data.inputRange
                    };
                } else {
                    inputRange = {
                        ...data.inputRange
                    };
                }

                return {
                    ...db,
                    [data.scrapeId]: {
                        ...db[data.scrapeId],
                        inputRange
                    }
                };
            }
        default:
            {
                return db;
            }
    }
}

const saveToDb = async(db, {type, data}) => {
    await dbReducer(db, {type, data});
    //database = await dbReducer(database, {type, data});
}

module.exports.getDb = getDb;
module.exports.saveToDb = saveToDb;
module.exports.initDb = initDb;
module.exports.getScrapeOptionsInputRange = getScrapeOptionsInputRange;
module.exports.getScrapeIds = getScrapeIds;
module.exports.getInputRange = getInputRange;
