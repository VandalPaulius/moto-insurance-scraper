const cwd = require('cwd');
const utils = require(cwd('utils'));

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

const riderDetails = async (page, db, scrapeId, continueToNext) => {
    const selectors = {
        continueToNext: '#ctl00_btnNext'
    }

    const inputRange = db.getDb()[scrapeId].inputRange;

    await ridingHistory(
        page,
        db,
        scrapeId,
        inputRange.riderDetails.ridingHistory
    );

    // if (continueToNext) {
    //     await page.click(selectors.continueToNext);
    // }
}

module.exports = riderDetails;