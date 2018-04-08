//process.env.NODE_PATH = __dirname;
require('dotenv').config()
// const uuidv1 = require('uuid/v1');
const utils = require('./utils');
// const scraper = require('./scraper');
const main = require('./main');

// // const inputRange = {
// //     quoteDetails: {
// //         personalDetails: {
// //             title: ['Mr', 'Miss'], // 'all'; [0, 2]
// //             maritalStatus: ['Married', 'Single'], // 'all'; [0, 1]
// //             ukResidentFrom: { // 'birth'
// //                 month: 12,
// //                 year: 1990
// //             },
// //             fullTimeEmployment: ['Employed', 'Unemplyed', 'Self-Emplyed'], // 'all'; [0, 1, 8]
// //         },
// //         partTimeEmploymentLess16Hrs: false, // true,
// //         licenceType: ['UK Full Bike', 'EU Full Bike'], // 'all'; [0, 5],
// //         selectedLicenceLength: ['Less than 1', '1'], // 'all'; [0, 1],
// //     }
// // }

// const inputRange = utils.initialInputValues.initialInputValues;

// const scrapeId = uuidv1();

// const db = utils.database.initDb();

// if (!db) {
//     console.log('Cannot run without database');
//     //return;
// }

// let scrapeOptions;

// for (let arg of process.argv) {
//     if (arg === '-scrapeOptions=true') {
//         scrapeOptions = true;
//     }
// }

// if (scrapeOptions) {
//     scraper.scrape({
//         scrapeId,
//         inputRange,
//         scrapeOptions: true
//     }).then((response) => {
//         if (response) {
//             console.log('Options scraped!');
//             console.log('DATABASE: ', utils.database.getDb());
//         }

//         console.log('Option scraping failed.');
//         console.log('DATABASE: ', utils.database.getDb());
//     });
// } else {
//     scraper.scrape({
//         scrapeId,
//         inputRange,
//     }).then((response) => {
//         if (typeof response === 'object') {
//             utils.database.saveToDb({
//                 type: 'quotes',
//                 data: {
//                     scrapeId: response.scrapeId,
//                     quotes: response.quotes
//                 }
//             });
//         }
        
//         console.log('DATABASE: ', utils.database.getDb());
//     });
// }


const distributor = async () => {
    const db = await utils.database.initDb();

    if (!db) {
        console.log('Cannot run without database.');
        return;
    }

    let options;

    console.log('process: ', process)

    for (let arg of process.argv) {
        let stop = false;
        console.log('arg: ',arg)

        switch (arg) {
            case '--scrape-options': {
                await main.scrapeOptions(db);
                stop = true;
                break;
            }
            case '--db-to-json': {
                await main.dbToJson(db);
                stop = true;
                break;
            }
            case '--generate-input-range': {
                await main.generateInputRange(db);
                stop = true;
                break;
            }
            case '--scrape-quotes': {
                await main.scrapeOptions(db);
                stop = true;
                break;
            }
        }

        if (stop) {
            break;
        }
    }

    console.log('Exiting gracefully.');
    return;
};

distributor();