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
        howLongLicence: {
            year: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerYears',
            month: '#ctl00_cphBody_qsProposerPersonalDetails_qLicenceLength_cboAnswerMonths'
        }
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

    await page.click(selectors.ukResidentFrom.month);
    await page.keyboard.type(`${inputRange.ukResidentFrom.month}`);

    await page.click(selectors.ukResidentFrom.year);
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
    );

    await page.select(
        selectors.licenceType,
        inputRange.licenceType.value
    );


    await page.select(
        selectors.howLongLicence.year,
        inputRange.selectedLicenceLength.year.value
    );
    if (inputRange.selectedLicenceLength.year.text === 'Less than 1') {
        await page.select(
            selectors.howLongLicence.month,
            inputRange.selectedLicenceLength.month.value
        );
    }
}

const address = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        postCode: '#ctl00_cphBody_qsAddressDetails_qPostcode_tbAnswer',
        findAddressButton: '#ctl00_cphBody_qsAddressDetails_btnAddressLookupButton_btnAddressLookup',
        addressDropdown: '#ctl00_cphBody_qsAddressDetails_qAddress_cboAnswer',
        mainPhone: '#ctl00_cphBody_qsAddressDetails_qDaytimeTel_tbAnswer',
        additionalPhone: '#ctl00_cphBody_qsAddressDetails_qEveningTel_tbAnswer',
        keptAtMainAdress: {
            yes: '#ctl00_cphBody_qsAddressDetails_qKeptOvernight_rbAnswer1',
            no: '#ctl00_cphBody_qsAddressDetails_qKeptOvernight_rbAnswer2'
        },
        overNightPostCode: '#ctl00_cphBody_qsAddressDetails_qOvernightPostcode_tbAnswer'
    }

    await utils.helpers.typeClean(
        page,
        selectors.postCode,
        inputRange.postCode
    )

    await page.click(selectors.findAddressButton);
    await utils.timing.loaded(page);

    // select address
    const typeClean = async (page, selector, value) => {
        await page.click(selector);
    
        await page.evaluate((selector) => {
            document.querySelector(selector).value = '';
        }, selector)
    
        await page.keyboard.type(value);
    }

    const selectAddress = async (page, selector) => {
        const findAddress = (addresses, address) => {
            const addressParts = address.split(' ');
            const abbreviations = {
                Rd: 'Road',
                Ave: 'Avenue',
                Ln: 'Lane',
                Dr: 'Drive',
                St: 'Street'
            }

            const addressPartsFixed = addressParts.map(addressItem => {
                for (let key of Object.keys(abbreviations)) {
                    if (key === addressItem) {
                        return abbreviations[key];
                    }
                }
                
                return addressItem;
            });

            
        }

        const options = await page.evaluate((selector) => {
            const addressList = document.querySelector(selector);
            const optionKeys = Object.keys(addressList);

            const options = optionKeys.map(key => {
                return {
                    value: addressList[key].value,
                    text: addressList[key].text
                }
            })

            return options;
        }, selector)

        findAddress(options, `285 Green Ln, Stockport`)

        console.log('options', options);
    }

    await selectAddress(page, selectors.addressDropdown);

    await utils.helpers.typeClean(
        page,
        selectors.mainPhone,
        inputRange.mainPhone
    )

    if (inputRange.additionalPhone) {
        await utils.helpers.typeClean(
            page,
            selectors.additionalPhone,
            inputRange.additionalPhone
        )
    }
    
    if (inputRange.keptAtMainAddress) {
        await page.click(selectors.keptAtMainAdress.yes);
    } else {
        await page.click(selectors.keptAtMainAdress.no);

        await utils.helpers.typeClean(
            page,
            selectors.overNightPostCode,
            inputRange.overNightPostCode
        )
    }
} 

const quoteDetails = async (page, db, scrapeId) => {
    const inputRange = db.getDb()[scrapeId].inputRange;

    await personal(page, db, scrapeId, inputRange.quoteDetails.personalDetails);
    await address(page, db, scrapeId, inputRange.quoteDetails.addressDetails);

    
}

module.exports = quoteDetails;