const uuidv1 = require('uuid/v1');
const cwd = require('cwd');
const utils = require(cwd('utils'));
const PromiseQueue = require('promise-queue');

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

const saveInputRangeToDb = async ({
    batchId,
    db,
    inputRange,
    scrapeId
}) => {
    await utils.database.saveToDb(
        db,
        {
            type: 'generateInputSaveInputRange',
            data: {
                batchId,
                inputRange,
                scrapeId
            }
        }
    );
}

// const mapToObject = (inputRangeRaw, ) => {
//     const toObj = (objectifiedOptions, key) => {
//         if (!objectifiedOptions[key]) {
//             objectifiedOptions = {
//                 ...objectifiedOptions,
//                 [key]: toObj(objectifiedOptions, ) // not done
//             };
//         }

//     }

//     let objectifiedOptions = {};

//     return Object.keys(inputRangeRaw).map((keyRaw) => {
//         const keyParts = keyRaw.split('_').filter((key, index) => {
//             if (index) {
//                 return key;
//             }
//         });

//         keyParts.map((key, index) => toObj)

//         const stuff = '';
//     });
// }


// const mapToObject = (inputRangeRaw, ) => {


//     let objectifiedOptions.asdasd = {};
//     let tempObj = {}
//     objectifiedOptions['asdasd']

//     return Object.keys(inputRangeRaw).map((keyRaw) => {
//         const keyParts = keyRaw.split('_').filter((key, index) => {
//             if (index) {
//                 return key;
//             }
//         });

//         for (let i = 0; i < keyParts.length; i++) {
//             tempObj = objectifiedOptions[keyParts[i]] // =  toObj(keyParts, startIndex, objectifiedOptions)
//         }

//         //keyParts.map((key, index) => toObj)

//         const stuff = '';
//     });
// }





// const mapToObject = (inputRangeRaw) => {
//     const toObj = ({
//         keyRaw,
//         keyParts,
//         startIndex,
//         objectifiedOptions
//     }) => {
//         // if (startIndex >= keyParts.length) {
//         //     return objectifiedOptions = inputRangeRaw[keyRaw];
//         // } else {
//         //     startIndex = startIndex + 1;

//         //     return toObj({
//         //         keyRaw,
//         //         keyParts,
//         //         startIndex,
//         //         objectifiedOptions: objectifiedOptions[keyParts[startIndex]]
//         //     })
//         // }
//         return 'adasd'
//     }

//     let objectifiedOptions = {};
//     let startIndex = 0;

//     const stuff = Object.keys(inputRangeRaw).map((keyRaw) => {
//         const keyParts = keyRaw.split('_').filter((key, index) => {
//             if (index) {
//                 return key;
//             }
//         });

//         return toObj({
//             keyRaw,
//             keyParts,
//             startIndex,
//             objectifiedOptions
//         })

//     });

//     console.log('stuff', stuff)

//     //return stuff;
// }

function assign(obj, keyPath, value) {
    const lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
      const key = keyPath[i];
      if (!(key in obj))
        obj[key] = {}
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
 }

 function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

 function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
  
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    return mergeDeep(target, ...sources);
  }

// const mapToObject = (inputRangeRaw) => {


//     let objectifiedOptions = {};
//     const objectArr = []
//     let merged = {};
    

//     Object.keys(inputRangeRaw).map((keyRaw) => {
//         const keyParts = keyRaw.split('_').filter((key, index) => {
//             if (index) {
//                 return key;
//             }
//         });

//         const tempObj = {};

//         assign(tempObj, keyParts, inputRangeRaw[keyRaw]) // kinda works

//         merged = mergeDeep(objectifiedOptions, assign(tempObj, keyParts, inputRangeRaw[keyRaw]))
        

//         //objectArr.push(tempObj)

//         /*let tempObj = {
//             [keyParts[0]]: {}
//         }*/

//         /*console.log()
//         for (let i = 1; i < keyParts.length; i++) {
//             if (i + 1 === keyParts.length) {
//                 tempObj[keyParts[i-1]] = {
//                     [keyParts[i]]: inputRangeRaw[keyRaw]
//                 }
//             } else {
//                 tempObj = getNestedObject(tempObj, [keyParts[i-1]])
//                 tempObj[keyParts[i-1]] = {
//                     [keyParts[i]]: {}
//                 }
                
//             }
//             //tempObj[keyParts[i]] = {} // =  toObj(keyParts, startIndex, objectifiedOptions)
//         }*/

//         //keyParts.map((key, index) => toObj)

//         const stuff = '';
//     });

//     console.log('objectArr: ', objectArr)

    
// }



const mapToObject = (inputRangeRaw) => {


        let objectifiedOptions = {};
        const objectArr = []
        let merged = {};

        const toObj = ({
            index,
            keys,
            keyRaw
        }) => {
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
        
    
        Object.keys(inputRangeRaw).map((keyRaw) => {
            const keyParts = keyRaw.split('_').filter((key, index) => {
                if (index) {
                    return key;
                }
            });
    
            const tempObj = {};
            objectArr.push(toObj({
                index: 0,
                keys: keyParts,
                keyRaw
            }))
    

    
            const stuff = '';
        });
    
        console.log('objectArr: ', objectArr)
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
        vals = [ vals ];
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
            
            const inputRange = inputRangeRaw; // map to object
            mapToObject(inputRangeRaw); // dev

            const scrapeId = uuidv1();
            // add to Promise queue to prevent premature process close
            promiseQueue.add(() => saveInputRangeToDb({
                batchId,
                db,
                inputRange,
                scrapeId
            }));

            resultCount.push('sucess');

            if (results) {
                results.push(inputRange);
            }
        }
    }

    if (results) {
        return {
            results,
            resultCount
        }
    } else {
        return resultCount;
    }
}

const generate = async ({
    db,
    scrapeOptions,
    batchId,
    promiseQueue
}) => {

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
        // // combinations quality control [start]
        // const combinationsNoDuplicates = utils.helpers
        //     .removeArrayDuplicates(combinations);
        // const combinationsSizeControl = combinationsNoDuplicates.filter((option) => {
        //     if (Object.keys(option).length === Object.keys(flatScrapeOptionsObj).length) {
        //         return option
        //     }
        // })
        // // combinations quality control [end]
    } catch (err) {
        return false;
    }

    return resultCountArr.length;
}

const generateInputRange = async (db) => {
    const cwd = require('cwd');
    const promiseQueue = new PromiseQueue(Infinity, Infinity);
    const batchId = uuidv1();

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
        console.error(`Cannot get data.${error ? ` Error: ${error}`: ''}`)
    } else {
        

        await utils.database.saveToDb(
            db,
            {
                type: 'generateInputRangeStarted',
                data: {
                    batchId,
                    startedAt: new Date()
                }
            }
        );

        batchSize = await generate({
            db,
            scrapeOptions,
            batchId,
            promiseQueue
        });

        if (!batchSize) {
            console.error(`Finished unsuccessfully.`)
            return;
        }
    }

    do {} while ( promiseQueue.getPendingLength() > 1
        && promiseQueue.getQueueLength() > 1 );

    await utils.database.saveToDb(
        db,
        {
            type: 'generateInputRangeFinished',
            data: {
                batchId,
                finishedAt: new Date(),
                batchSize
            }
        }
    );

    console.log('Finished successfully');
}

module.exports = generateInputRange;
