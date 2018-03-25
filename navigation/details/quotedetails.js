const cwd = require('cwd');
const utils = require(cwd('utils'));

const personal = async (page, db, scrapeId) => {
    const selectors = {
        titleDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qTitle_cboAnswer'
    }

    const elementIds = {
        titleDropdown: 'ctl00_cphBody_qsProposerPersonalDetails_qTitle_cboAnswer'
    }

    const inputRange = db.getDb()[scrapeId].inputRange;

    console.log('inputRange', inputRange)
    
    // await page.click(selectors.titleDropdown);
    // const dalykai = await page.evaluate((titleDropdown) => { // does not fire
    //     console.log('evaluate')
    //     const children = document.getElementById(titleDropdown)
    //         .childNodes;

    //     const childrenKeys = Object.keys(children);

    //     const options = childrenKeys.filter((childKey) => {
    //         if (children[childKey].nodeName === "OPTION") {
    //             return children[childKey]
    //         }
    //     })
        
        

    //     //const options = children.
    //     console.log('children', children)
    //     return JSON.stringify(children);
    // }, elementIds.titleDropdown)

    // await page.select(
    //     selectors.titleDropdown,
    //     inputRange.quoteDetails.personalDetails.title
    // );

    await page.select(
        selectors.titleDropdown,
        inputRange.quoteDetails.personalDetails.title.value
    );
    // await page.select(
    //     selectors.titleDropdown,
    //     'Mr'
    // );

    //console.log('dalyka: ', dalykai)

    console.log('after eval')
    // await page.click(selectors.username);
    // await page.keyboard.type(process.env.GO_COMPARE_USERNAME);
} 

const quoteDetails = async (page, db, scrapeId) => {
    await personal(page, db, scrapeId);

    
}

module.exports = quoteDetails;