const cwd = require('cwd');
const utils = require(cwd('utils'));

const personal = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        titleDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qTitle_cboAnswer',
        maritalStatus: '#ctl00_cphBody_qsProposerPersonalDetails_qMaritalStatus_cboAnswer',
        ukResidentFrom: {
            checkbox: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_chkCheckBox',
            month: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_tbMonth',
            year: '#ctl00_cphBody_qsProposerPersonalDetails_qUKResidentFrom_tbYear'
        },
        employmentDropdown: '#ctl00_cphBody_qsProposerPersonalDetails_qFullTimeEmploymentStatus_cboAnswer',
        partTimeEmployment: {
            yes: '#ctl00_cphBody_qsProposerPersonalDetails_qPartTimeEmployment_rbAnswer1',
            no: '#ctl00_cphBody_qsProposerPersonalDetails_qPartTimeEmployment_rbAnswer2'
        },
        licenceType: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceType_cboAnswer',
        howLongLicence: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerYears'
    }
    const elementIds = {
        titleDropdown: 'ctl00_cphBody_qsProposerPersonalDetails_qTitle_cboAnswer'
    }

    // First column
    await page.select(
        selectors.titleDropdown,
        inputRange.title.value
    );

    await page.select(
        selectors.maritalStatus,
        inputRange.maritalStatus.value
    );

    await utils.helpers.checkbox(
        page,
        selectors.ukResidentFrom.checkbox,
        false
    );

    await page.click(selectors.ukResidentFrom.month)
    await page.keyboard.type(`${inputRange.ukResidentFrom.month}`);

    await page.click(selectors.ukResidentFrom.year)
    await page.keyboard.type(`${inputRange.ukResidentFrom.year}`);

    // Second column
    await page.select(
        selectors.employmentDropdown,
        inputRange.fullTimeEmployment.value
    );

    if (inputRange.partTimeEmploymentLess16Hrs) {
        await page.click(selectors.partTimeEmployment.yes);
    } else {
        await page.click(selectors.partTimeEmployment.no);
    }

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    )

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    )

    await page.select(
        selectors.howLongLicence,
        inputRange.selectedLicenceLength.value
    )
    //console.log('dalyka: ', dalykai)

    console.log('after eval')
    // await page.click(selectors.username);
    // await page.keyboard.type(process.env.GO_COMPARE_USERNAME);
} 

const quoteDetails = async (page, db, scrapeId) => {
    const inputRange = db.getDb()[scrapeId].inputRange;

    await personal(page, db, scrapeId, inputRange.quoteDetails.personalDetails);

    
}

module.exports = quoteDetails;