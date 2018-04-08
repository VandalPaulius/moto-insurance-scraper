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

const dbReducer = async (db, {type, data}) => {
    switch (type) {
        case 'scrapeOptionsSaveStartedDate':
            {
                db
                    .collection('SCRAPE_OPTIONS')
                    .insert({
                        _id: data.scrapeId,
                        startedAt: data.startedAt
                    });
                break;
            }
        case 'scrapeOptionsSaveEndedDate':
            {
                db
                    .collection('SCRAPE_OPTIONS')
                    .insert({
                        _id: data.scrapeId,
                        startedAt: data.endedAt
                    });
                break;
            }
        case 'scrapeOptionsInputRange':
            {
                const database = {
                    ...db,
                    scrapeOptions: {
                        ...db.scrapeOptions,
                        [data.scrapeId]: {
                            ...db.scrapeOptions[data.scrapeId]
                        }
                    }
                };

                if (!db.scrapeOptions[data.scrapeId]) {
                    database.scrapeOptions = {
                        ...db.scrapeOptions,
                        [data.scrapeId]: {
                            inputRange: data.inputRange
                        }
                    }
                } else {
                    database.scrapeOptions = {
                        ...db.scrapeOptions,
                        [data.scrapeId]: {
                            ...db.scrapeOptions[data.scrapeId],
                            inputRange: {
                                ...db.scrapeOptions[data.scrapeId].inputRange,
                                ...data.inputRange
                            }
                        }
                    }
                }

                return database;
            }
        case 'scrapeOptions':
            {
                return {
                    ...db,
                    scrapeOptions: {
                        ...db.scrapeOptions,
                        [data.scrapeId]: {
                            ...db.scrapeOptions[data.scrapeId],
                            [data.name]: data.options
                        }
                    }
                };
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
