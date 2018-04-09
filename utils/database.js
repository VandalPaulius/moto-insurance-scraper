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
        console.log(err);
    }

    await db.createCollection('SCRAPE_OPTIONS');

    return db;
}

const getDb = () => {
    return database;
}

const dbReducer = async(db, {type, data}) => {
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
                            endedAt: data.endedAt
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
