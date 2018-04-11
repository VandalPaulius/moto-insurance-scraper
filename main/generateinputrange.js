const uuidv1 = require('uuid/v1');

const traverse = (scrapeOptions) => {
    console.log('scrapeOptions', scrapeOptions)

    const options = Object.keys(scrapeOptions).map((pageKey) => {
        return Object.keys(scrapeOptions[pageKey]).map((partKey) => {
            return Object.keys(scrapeOptions[pageKey][partKey]).map((partItemKey) => {
                const partItem = scrapeOptions[pageKey][partKey][partItemKey];

                if (partItem instanceof Array) {
                    return partItem[0]; // temporary
                } else if (typeof partItem === 'object') {
                    if (partItem.example && partItem.value instanceof Array) {
                        return partItem.value[0]; // temporary
                    } else if (partItem.from && partItem.to) {
                        return partItem.from // temporary
                    } else if (partItem.year && partItem.month) {
                        // return Object.keys(partItem).map
                    }
                } else if (typeof partItem === 'number') {
                    return partItem;
                }
            })
            //console.log('typeof partItem', typeof partItem)
            // if (typeof partItem === 'array') {
                
            // }
        })
    });
 
    console.log('traverse options: ', options);
}

// const flatten = (scrapeOptions, name) => {
//     let flatOptions = {};

//     Object.keys(scrapeOptions).map((optionKey) => {
//         if (typeof scrapeOptions[optionKey] === 'object'
//             && !(scrapeOptions[optionKey] instanceof Array)
//         ) {
//             flatOptions = {
//                 ...flatOptions,
//                 [`${name}_${optionKey}`]: flatten(scrapeOptions[optionKey], optionKey)
//             }
//         } else {
//             flatOptions[optionKey] = scrapeOptions[optionKey];
//         }
//     })

//     return flatOptions;
// }

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
        // if (typeof scrapeOptions[optionKey] === 'object'
        //     && !(scrapeOptions[optionKey] instanceof Array)
        // ) {
        //     flatOptions = {
        //         ...flatOptions,
        //         [`${name}_${optionKey}`]: flatten(scrapeOptions[optionKey], optionKey)
        //     }
        // } else {
        //     flatOptions[optionKey] = scrapeOptions[optionKey];
        // }
    })

    return flatOptions;
}

const generate = async ({
    db,
    scrapeOptions
}) => {

    let outputOptions = [];
    let scrapeOptionsInternal = JSON.parse(JSON.stringify(scrapeOptions)); // deep copy

    // scrapeOptions.quoteDetails.addressDetails.postCode.value.map((index) => {
        
    // })


    //const options = traverse(scrapeOptionsInternal);

    const flatScrapeOptions = flatten(scrapeOptions, '');
    console.log('flatScrapeOptions', flatScrapeOptions)

    let option = {
        //quoteDetails
    };
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
