let database = {};

const initDb = () => {
    database = {
        scrapeOptions: {}
    }
}

const getDb = () => {
    return database;
}

const dbReducer = (db, { type, data }) => {
    switch (type) {
        case 'scrapeOptionsInputRange': {
            const database =  {
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
        case 'scrapeOptions': {
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
        case 'quotes': {
            return {
                ...db,
                [data.scrapeId]: {
                    ...db[data.scrapeId],
                    quotes: data.quotes
                }
            };
        }
        case 'input': {
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
        case 'inputRange': {
            let inputRange;

            if (db[data.scrapeId]) {
                inputRange = {
                    ...db[data.scrapeId].inputRange,
                    ...data.inputRange
                };
            } else {
                inputRange = { ...data.inputRange };
            }

            return {
                ...db,
                [data.scrapeId]: {
                    ...db[data.scrapeId],
                    inputRange
                }
            };
        }
        default: {
            return db;
        }
    }
}

const saveToDb = ({ type, data }) => {
    database = dbReducer(database, { type, data });
}

module.exports.getDb = getDb;
module.exports.saveToDb = saveToDb;
module.exports.initDb = initDb;
