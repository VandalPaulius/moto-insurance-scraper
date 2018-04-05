let database = {};

const getDb = () => {
    return database;
}

const dbReducer = (db, { type, data }) => {
    switch (type) {
        case 'quotes': {
            return {
                ...db,
                [data.scrapeId]: {
                    ...db[data.scrapeId],
                    quotes: data.quotes
                }
            }
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
            }
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
            }
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