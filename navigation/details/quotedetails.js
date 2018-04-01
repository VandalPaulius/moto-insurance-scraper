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

    const selectAddress = async (page, selector, inputRangeAddress) => {
        const findAddress = (addresses, address) => {
            const addressCleared = address.replace(/[^a-zA-Z0-9-\s]+/g, '');

            const addressParts = addressCleared.split(' ');
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

            for (let address of addresses) {
                let match = [];

                for (let i = 0; i < addressPartsFixed.length; i++) {
                    const pattern = new RegExp(addressPartsFixed[i], 'i');

                    match[i] = pattern.test(address.text);
                }

                const matchedCount = match.filter(item => item === true).length;

                if (matchedCount === addressPartsFixed.length) {
                    return address;
                }
            }
        }

        const options = await utils.helpers.getOptions(page, selector);
        const address = findAddress(options, inputRangeAddress);

        await page.select(selector, address.value);
    }

    await selectAddress(page, selectors.addressDropdown, inputRange.address);

    await utils.helpers.typeClean(
        page,
        selectors.mainPhone,
        inputRange.mainPhone
    );

    if (inputRange.additionalPhone) {
        await utils.helpers.typeClean(
            page,
            selectors.additionalPhone,
            inputRange.additionalPhone
        );
    }
    
    if (inputRange.keptAtMainAddress) {
        await page.click(selectors.keptAtMainAdress.yes);
    } else {
        await page.click(selectors.keptAtMainAdress.no);

        await utils.helpers.typeClean(
            page,
            selectors.overNightPostCode,
            inputRange.overNightPostCode
        );
    }
}

const bikeDetails = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        knowRegNumber: {
            yes: '#ctl00_cphBody_qsVehicleSelection_qKnowRegNo_rbAnswer1',
            no: '#ctl00_cphBody_qsVehicleSelection_qKnowRegNo_rbAnswer2'
        },
        bikeMake: '#ctl00_cphBody_qsVehicleSelection_qVehicleMake_cboAnswer',
        manufactureYear: '#ctl00_cphBody_qsVehicleSelection_qYearOfMan_tbAnswer',
        engineSize: {
            isElectric: '#ctl00_cphBody_qsVehicleSelection_qEngineSizeCC_chkCheckBox',
            engineCC: '#ctl00_cphBody_qsVehicleSelection_qEngineSizeCC_tbAnswer'
        },
        findVehicleButton: '#ctl00_cphBody_qsVehicleSelection_btnVehicleLookupDontKnowRegButton_btnVehicleLookup',
        vehicleDropdown: '#ctl00_cphBody_qsVehicleSelection_qConfirmVehicleDontKnowReg_cboAnswer'
    }

    const selectMake = async (page, selector, bikeMake) => {
        const options = await utils.helpers.getOptions(page, selector)

        let brand;
        const regex = (pattern) => new RegExp(`(${pattern})(?!.)`, 'i');
        
        for (let option of options) {
            if(regex(bikeMake).test(option.text)) {
                // workaround for RegExp 'lookbehind' non existance in Javascript
                const optionTextBackwards = option.text
                    .split('')
                    .reverse()
                    .join('');
                const bikeMakeBackwards = bikeMake
                    .split('')
                    .reverse()
                    .join('');

                if (regex(bikeMakeBackwards).test(optionTextBackwards)) {
                    brand = option;
                }
            }
        }

        await page.select(selector, brand.value);
    }

    const selectBike = async (page, selector, bike, manufactureYear) => {
        const options = await utils.helpers.getOptions(page, selector);

        let match;
        const pattern = new RegExp(bike, 'i');

        for (let option of options) {
            if (pattern.test(option.text)) {
                match = option;
                break;
            }
        }

        await page.select(selector, match.value);
    }

    if (inputRange.knowRegNumber) {
        await page.click(selectors.knowRegNumber.yes);
    } else {
        await page.click(selectors.knowRegNumber.no);
    }

    await selectMake(page, selectors.bikeMake, inputRange.bikeMake);

    await utils.helpers.typeClean(
        page,
        selectors.manufactureYear,
        inputRange.manufactureYear
    );

    if (inputRange.engineSize.isElectric) {
        await page.click(selectors.engineSize.isElectric);
    } else {
        await utils.helpers.typeClean(
            page,
            selectors.engineSize.engineCC,
            inputRange.engineSize.engineCC
        );
    }

    await page.click(selectors.findVehicleButton);
    await utils.timing.loaded(page);

    await selectBike(page, selectors.vehicleDropdown, inputRange.bike);
}

const coverDetails = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        coverType: '#ctl00_cphBody_qsCoverDetails_qTypeOfCover_cboAnswer',
        bikeNoClaims: '#ctl00_cphBody_qsCoverDetails_qNCB_cboAnswer',
        ridersCount: '#ctl00_cphBody_qsCoverDetails_qNoOfDrivers_cboAnswer',
        bikeUse: '#ctl00_cphBody_qsCoverDetails_qUseOfVehicle_cboAnswer'
    }

    // first column
    await page.select(
        selectors.coverType,
        inputRange.coverType.value
    );

    await page.select(
        selectors.bikeNoClaims,
        inputRange.bikeNoClaims.value
    );

    // second column
    await page.select(
        selectors.ridersCount,
        inputRange.ridersCount.value
    );

    await page.select(
        selectors.bikeUse,
        inputRange.bikeUse.value
    );
}

const quoteDetails = async (page, db, scrapeId, continueToNext) => {
    const selectors = {
        continueToNext: '#ctl00_btnNext'
    }

    const inputRange = db.getDb()[scrapeId].inputRange;

    await personal(page, db, scrapeId, inputRange.quoteDetails.personalDetails);
    await address(page, db, scrapeId, inputRange.quoteDetails.addressDetails);
    await bikeDetails(page, db, scrapeId, inputRange.quoteDetails.bikeDetails);
    await coverDetails(page, db, scrapeId, inputRange.quoteDetails.coverDetails);

    if (continueToNext) {
        await page.click(selectors.continueToNext);
    }
}

module.exports = quoteDetails;