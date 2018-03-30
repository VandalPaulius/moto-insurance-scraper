process.env.NODE_PATH = __dirname;
require('dotenv').config()
const puppeteer = require('puppeteer');
const uuidv1 = require('uuid/v1');

const utils = require('./utils');
const navigation = require('./navigation');

// const inputRange = {
//     quoteDetails: {
//         personalDetails: {
//             title: ['Mr', 'Miss'], // 'all'; [0, 2]
//             maritalStatus: ['Married', 'Single'], // 'all'; [0, 1]
//             ukResidentFrom: { // 'birth'
//                 month: 12,
//                 year: 1990
//             },
//             fullTimeEmployment: ['Employed', 'Unemplyed', 'Self-Emplyed'], // 'all'; [0, 1, 8]
//         },
//         partTimeEmploymentLess16Hrs: false, // true,
//         licenceType: ['UK Full Bike', 'EU Full Bike'], // 'all'; [0, 5],
//         selectedLicenceLength: ['Less than 1', '1'], // 'all'; [0, 1],
//     }
// }

const inputRange = {
    quoteDetails: {
        personalDetails: {
            title: {
                text: 'Mr',
                value: '1'
            },
            maritalStatus: {
                text: 'Single',
                value: '7'
            },
            ukResidentFrom: {
                month: 7,
                year: 2017
            },
            fullTimeEmployment: {
                text: 'Employed',
                value: '27'
            },
            partTimeEmploymentLess16Hrs: false,
            licenceType: {
                text: 'EU Full Bike',
                value: '385'
            },
            selectedLicenceLength: {
                year: {
                    text: 'Less than 1',
                    value: '1137'
                },
                month: {
                    text: '11',
                    value: '1149'
                }
            }
        },
        addressDetails: {
            postCode: 'SK4 2LZ',
            overNightPostCode: 'SK4 2LC',
            mainPhone: '07954463999',
            additionalPhone: '07954463991',
            keptAtMainAddress: true,
            address: '285 Green Ln, Stockport'
        },
        bikeDetails: {
            knowRegNumber: false,
            bikeMake: 'Honda',
            manufactureYear: '2014',
            engineSize: {
                isElectric: false,
                engineCC: '125'
            },
            bike: 'HONDA CBF 125, 2008 onwards, 124cc, Manual, Petrol, Dual-Purpose' // as in the list
        },
        coverDetails: {
            coverType: {
                value: '108',
                text: 'Third Party Fire & Theft'
            },
            bikeNoClaims: {
                value: '109',
                text: 'None'
            },
            ridersCount: {
                value: '235',
                text: 'Proposer & 1 other'
            },
            bikeUse: {
                value: '228',
                text: 'Social including commuting to a single place of work'
            }
        }
    },
    riderDetails: {
        ridingHistory: {
            ridingQualifications: {
                value: '140',
                text: 'None'
            },
            bikeOrganisation: {
                value: '402',
                text: 'None'
            },
            carLicence: {
                value: '126',
                text: 'EU full'
            },
            carLicenceLength: {
                year: {
                    value: '1137',
                    text: 'Less than 1'
                },
                month: {
                    value: '1144',
                    text: '6'
                }
            },
            haveCar: {
                value: '957',
                text: 'No'
            },
            cbtPassed: {
                passed: true,
                year: '2016',
                month: '7'
            },
            riddenBikeLastYear: {
                ridden: true,
                engineCC: '660',
                yearsRiding: {
                    value: '0',
                    text: '0 (Less than a year)'
                }
            }
        }
    }
}

const scrape = async () => {
    const scrapeId = uuidv1();

    console.log('scrape it');
    utils.database.saveToDb({
        type: 'inputRange',
        data: {
            scrapeId,
            inputRange
        }
    }) // populate database with input ranges for one scrape

    const browser = await puppeteer.launch({
        headless: false,
        //slowMo: 1000 // for fully operational mode
    });
    const page = await browser.newPage();

    await page.setViewport({width: 1200, height: 500})
    await page.goto(process.env.URL_TO_SCRAPE);

    await navigation.main.homeToLogin(page);

    await navigation.main.login(page);
    await utils.timing.show(page);

    await navigation.dashboard.removeSuperfluousQuotes(page);

    await navigation.dashboard.newQuote(page);

    await navigation.details.quoteDetails(
        page,
        utils.database,
        scrapeId,
        true
    );
    await utils.timing.loaded(page);
    await navigation.details.riderDetails(
        page,
        utils.database,
        scrapeId,
        true
    );
    // await navigation.details.bikeDetails(page, utils.database);
    // await navigation.details.coverDetails(page, utils.database);

    // await navigation.main.logout(page);
    // await browser.close();
}

scrape().then((values) => {
    console.log('values: ', values);
});