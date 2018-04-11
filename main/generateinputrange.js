const uuidv1 = require('uuid/v1');
const cwd = require('cwd');
const utils = require(cwd('utils'));
const combinatorics = require('js-combinatorics');

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





function combinations(variants) {
    return (function recurse(keys) {

        if (!keys.length) return [{}];

        let result = recurse(keys.slice(1));
        return variants[keys[0]].reduce( (acc, value) =>
            acc.concat( result.map( item => 
                Object.assign({}, item, { [keys[0]]: value }) 
            ) ),
            []
        );

    })(Object.keys(variants));
}     

// const combinations = (variants) => {
//     const recurse = (keys) => {
//         if (!keys.length) {
//             return [];
//         }


//     }

//     // return (function recurse(keys) {

//     //     if (!keys.length) return [{}];

//     //     // let result = recurse(keys.slice(1));
//     //     // return variants[keys[0]].reduce( (acc, value) =>
//     //     //     acc.concat( result.map( item => 
//     //     //         Object.assign({}, item, { [keys[0]]: value }) 
//     //     //     ) ),
//     //     //     []
//     //     // );

//     //     console.log('keys', keys)
        
//     // })(Object.keys(variants));

//     return recurse(Object.keys(variants));
// }  





// function getCombinations(options, optionIndex, results, current) {
//     var allKeys = Object.keys(options);
//     var optionKey = allKeys[optionIndex];

//     var vals = options[optionKey];

//     for (var i = 0; i < vals.length; i++) {
//         current[optionKey] = vals[i];

//         if (optionIndex + 1 < allKeys.length) {
//             getCombinations(options, optionIndex + 1, results, current);
//         } else {
//             // The easiest way to clone an object.
//             var res = JSON.parse(JSON.stringify(current));
//             results.push(res);
//         }
//     }

//     return results;
// }

function getCombinations(options, optionIndex, results, current) {
    var allKeys = Object.keys(options);
    var optionKey = allKeys[optionIndex];

    var vals = options[optionKey];

    // let valsLength;
    // if (!(vals instanceof Array)) {
    //     valsLength = 1;
        
    // } else {
    //     valsLength = vals.length;
    // }

    if (!(vals instanceof Array)) {
        vals = [ vals ];
        
    } /*else {
        valsLength = vals.length;
    }*/

    for (var i = 0; i < vals.length; i++) {
        current[optionKey] = vals[i];




        if (optionIndex === 75 || optionIndex === 26) {
            console.log('optionIndex finish 75')
        }




        if (optionIndex + 1 < allKeys.length) {
            getCombinations(options, optionIndex + 1, results, current);
        } else {
            // The easiest way to clone an object.
            var res = JSON.parse(JSON.stringify(current));
            results.push(res);
        }
    }

    return results;
}

const removeDuplicates = (listWithDuplicates) => {
    const bikesTempFlatStrings = listWithDuplicates.map(bike => JSON.stringify(bike));
    const bikesNoDuplicatesStringsSet = new Set(bikesTempFlatStrings);
    const bikesNoDuplicatesStrings = Array.from(bikesNoDuplicatesStringsSet);
    return bikesNoDuplicatesStrings.map(bikeString => JSON.parse(bikeString))
}


const generate = async ({
    db,
    scrapeOptions
}) => {

    let outputOptions = [];
    let scrapeOptionsInternal = JSON.parse(JSON.stringify(scrapeOptions)); // deep copy

    const scrapeOptionsGenerated = generateRanges(scrapeOptions);
    const flatScrapeOptionsObj = flatten(scrapeOptionsGenerated, '');
    // const flatScrapeOptions = Object.keys(flatScrapeOptionsObj)
    //     .map(key => flatScrapeOptionsObj[key]);
    // console.log('flatScrapeOptions', flatScrapeOptions)



    // const combinations = combinatorics.bigCombination(flatScrapeOptions);

    // console.log('combinations', combinations);
    // let a;
    // while(a = combinations.next()) console.log(a);

    //const comb = combinations(flatScrapeOptions);
    const comb = getCombinations(flatScrapeOptionsObj, 0, [], {});
    console.log('comb', comb)
    const combNoDuplicates = removeDuplicates(comb);
    console.log('combNoDuplicates', combNoDuplicates)
    const combSizeControl = combNoDuplicates.filter((option) => {
        if (Object.keys(option).length === 76) {
            return option
        }
    })

    const combSizeControlString = JSON.stringify(combSizeControl)
    
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
