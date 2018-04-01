const cwd = require('cwd');
const utils = require(cwd('utils'));

const claimsAndConvictions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        claimsAccidents5Years: {
            yes: '#ctl00_cphBody_qsClaimsAndConvictions_qAnyClaims_rbAnswer1',
            no: '#ctl00_cphBody_qsClaimsAndConvictions_qAnyClaims_rbAnswer2'
        },
        motorConvictions: {
            yes: '#ctl00_cphBody_qsClaimsAndConvictions_qAnyConvictions_rbAnswer1',
            no: '#ctl00_cphBody_qsClaimsAndConvictions_qAnyConvictions_rbAnswer2'
        }
    };

    await page.click(selectors.claimsAccidents5Years.no);

    await page.click(selectors.motorConvictions.no);
}

const ridingHistory = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        ridingQualificationsDropdown: '#ctl00_cphBody_qsRidingHistory_qRidingQualification_cboAnswer',
        bikeOrganisationDropdown: '#ctl00_cphBody_qsRidingHistory_qBikeOrgMember_cboAnswer',
        carLicenceDropdown: '#ctl00_cphBody_qsRidingHistory_qHoldCarLicence_cboAnswer',
        carLincenceLength: {
            yearDropdown: '#ctl00_cphBody_qsRidingHistory_qCarLicenceLength_cboAnswerYears',
            monthDropdown: '#ctl00_cphBody_qsRidingHistory_qCarLicenceLength_cboAnswerMonths'
        },
        haveCarDropdown: '#ctl00_cphBody_qsRidingHistory_qPrivateCar_cboAnswer',
        CBT: {
            noCBTCheckbox: '#ctl00_cphBody_qsRidingHistory_qCBTPassed_chkCheckBox',
            year: '#ctl00_cphBody_qsRidingHistory_qCBTPassed_tbYear',
            month: '#ctl00_cphBody_qsRidingHistory_qCBTPassed_tbMonth'
        },
        riddenBikeLastYear: {
            yes: '#ctl00_cphBody_qsRidingHistory_qOwnedRiddenBike_rbAnswer1',
            no: '#ctl00_cphBody_qsRidingHistory_qOwnedRiddenBike_rbAnswer2',
            engineCC: '#ctl00_cphBody_qsRidingHistory_qEngineSizeCC_tbAnswer',
            yearsRidingDropdown: '#ctl00_cphBody_qsRidingHistory_qYearsContRiding_cboAnswer'
        }
    };

    // first column
    await page.select(
        selectors.ridingQualificationsDropdown,
        inputRange.ridingQualifications.value
    );

    await page.select(
        selectors.bikeOrganisationDropdown,
        inputRange.bikeOrganisation.value
    );

    await page.select(
        selectors.carLicenceDropdown,
        inputRange.carLicence.value
    );

    await page.select(
        selectors.carLincenceLength.yearDropdown,
        inputRange.carLicenceLength.year.value
    );
    if (inputRange.carLicenceLength.year.value === '1137'
        || inputRange.carLicenceLength.year.text === 'Less than 1'
    ) {
        await page.select(
            selectors.carLincenceLength.monthDropdown,
            inputRange.carLicenceLength.month.value
        );
    }

    await page.select(
        selectors.carLicenceDropdown,
        inputRange.carLicence.value
    );
    
    // second column
    const isSelected = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element.checked;
    }, selectors.CBT.noCBTCheckbox);

    if (inputRange.cbtPassed.passed && isSelected) {
        await page.click(selectors.CBT.noCBTCheckbox);
    } else if (!inputRange.cbtPassed.passed && !isSelected) {
        await page.click(selectors.CBT.noCBTCheckbox);
    }

    if (inputRange.cbtPassed.passed) {
        await utils.helpers.typeClean(
            page,
            selectors.CBT.year,
            inputRange.cbtPassed.year
        );

        await utils.helpers.typeClean(
            page,
            selectors.CBT.month,
            inputRange.cbtPassed.month
        );
    }

    if (inputRange.riddenBikeLastYear.ridden) {
        await page.click(selectors.riddenBikeLastYear.yes);

        await utils.helpers.typeClean(
            page,
            selectors.riddenBikeLastYear.engineCC,
            inputRange.riddenBikeLastYear.engineCC
        );

        await page.select(
            selectors.riddenBikeLastYear.yearsRidingDropdown,
            inputRange.riddenBikeLastYear.yearsRiding.value
        );
    } else {
        await page.click(selectors.riddenBikeLastYear.no);
    }
}

const generalDetails = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        medicalConditionsDropdown: '#ctl00_cphBody_qsGeneralDetails_qAnyMedConditions_cboAnswer',
        totalBikesOwned: '#ctl00_cphBody_qsGeneralDetails_qNumberOfCars_tbAnswer',
        otherVehiclesDropdown: '#ctl00_cphBody_qsGeneralDetails_qUseOfVehicles_cboAnswer',
        nonMotorCriminalConvictions: {
            yes: '#ctl00_cphBody_qsGeneralDetails_qNonMotoringConvictions_rbAnswer1',
            no: '#ctl00_cphBody_qsGeneralDetails_qHomeOwner_rbAnswer2'
        },
        homeOwner: {
            yes: '#ctl00_cphBody_qsGeneralDetails_qHomeOwner_rbAnswer1',
            no: '#ctl00_cphBody_qsGeneralDetails_qHomeOwner_rbAnswer2'
        },
        childrenUnder16: {
            yes: '#ctl00_cphBody_qsGeneralDetails_qAnyChildrenUnder16_rbAnswer1',
            no: '#ctl00_cphBody_qsGeneralDetails_qAnyChildrenUnder16_rbAnswer2'
        }
    };

    // first column
    await page.select(
        selectors.medicalConditionsDropdown,
        inputRange.medicalConditions.value
    );
    
    await utils.helpers.typeClean(
        page,
        selectors.totalBikesOwned,
        inputRange.totalBikesOwned
    );

    await page.select(
        selectors.otherVehiclesDropdown,
        inputRange.otherVehicles.value
    );

    // second column
    await page.click(selectors.nonMotorCriminalConvictions.no);

    if (inputRange.homeOwner) {
        await page.click(selectors.homeOwner.yes);
    } else {
        await page.click(selectors.homeOwner.no);
    }
    
    if (inputRange.childrenUnder16) {
        await page.click(selectors.childrenUnder16.yes);
    } else {
        await page.click(selectors.childrenUnder16.no);
    }
}

const occupationDetails = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        occupation: {
            showAll: '#ctl00_cphBody_qsOccupationDetails_qFullTimeOccupation_lnkShowAll',
            list: '#ctl00_cphBody_qsOccupationDetails_qFullTimeOccupation_lstShowAllListbox',
            selectValue: (optionNumber) => `#ctl00_cphBody_qsOccupationDetails_qFullTimeOccupation_lstShowAllListbox > option:nth-child(${parseInt(optionNumber) + 1})`
        },
        business: {
            showAll: '#ctl00_cphBody_qsOccupationDetails_qFullTimeTypeOfBusiness_lnkShowAll',
            list: '#ctl00_cphBody_qsOccupationDetails_qFullTimeTypeOfBusiness_lstShowAllListbox',
            selectValue: (optionNumber) => `#ctl00_cphBody_qsOccupationDetails_qFullTimeTypeOfBusiness_lstShowAllListbox > option:nth-child(${parseInt(optionNumber) + 1})`
        }
    };

    await page.click(selectors.occupation.showAll);
    await utils.timing.loaded(page);
    await page.click(
        selectors.occupation.selectValue(inputRange.occupation.value)
    );

    await page.click(selectors.business.showAll);
    await utils.timing.loaded(page);
    await page.click(
        selectors.business.selectValue(inputRange.business.value)
    );
}

const riderDetails = async (page, db, scrapeId, continueToNext) => {
    const selectors = {
        continueToNext: '#ctl00_btnNext'
    }

    const inputRange = db.getDb()[scrapeId].inputRange;

    await claimsAndConvictions(
        page,
        db,
        scrapeId,
        inputRange.riderDetails.claimsAndConvictions
    );

    await ridingHistory(
        page,
        db,
        scrapeId,
        inputRange.riderDetails.ridingHistory
    );

    await generalDetails(
        page,
        db,
        scrapeId,
        inputRange.riderDetails.generalDetails
    );

    await occupationDetails(
        page,
        db,
        scrapeId,
        inputRange.riderDetails.occupationDetails
    );

    if (continueToNext) {
        await page.click(selectors.continueToNext);
    }
}

module.exports = riderDetails;