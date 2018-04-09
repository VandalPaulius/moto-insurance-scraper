const cwd = require('cwd');
const utils = require(cwd('utils'));

const coverInfo = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        coverStartDate: {
            year: '#ctl00_cphBody_qsCoverDetailsFinalPage_qCoverStartDate_tbYYYY',
            month: '#ctl00_cphBody_qsCoverDetailsFinalPage_qCoverStartDate_tbMM',
            day: '#ctl00_cphBody_qsCoverDetailsFinalPage_qCoverStartDate_tbDD'
        },
        renewalPrice: '#ctl00_cphBody_qsCoverDetailsFinalPage_qBestQuote_tbAnswer',
        voluntaryExcessDropdown: '#ctl00_cphBody_qsCoverDetailsFinalPage_qVolExcess_cboAnswer',
        annualMileageDropdown: '#ctl00_cphBody_qsCoverDetailsFinalPage_qTotalAnnualMileage_cboAnswer',
        pay: {
            monthly: '#ctl00_cphBody_qsCoverDetailsFinalPage_qPaymentType_rbAnswer1',
            yearly: '#ctl00_cphBody_qsCoverDetailsFinalPage_qPaymentType_rbAnswer2'
        },
        declinedOrSpecialTerms: {
            yes: '#ctl00_cphBody_qsCoverDetailsFinalPage_qInsuranceDeclined_rbAnswer1',
            no: '#ctl00_cphBody_qsCoverDetailsFinalPage_qInsuranceDeclined_rbAnswer2'
        }
    };

    const typeDate = async (page, selector, plusDays) => {
        const date = new Date;

        date.setDate(date.getDate() + parseInt(plusDays));

        await utils.helpers.typeClean(
            page,
            selector.day,
            date.getDate().toString()
        );

        const month = (parseInt(date.getMonth().toString()) + 1).toString();
        await utils.helpers.typeClean(
            page,
            selector.month,
            month
        );

        await utils.helpers.typeClean(
            page,
            selector.year,
            date.getFullYear().toString()
        );
    }

    // first column
    await typeDate(
        page,
        selectors.coverStartDate,
        inputRange.plusDays
    );

    await utils.helpers.typeClean(
        page,
        selectors.renewalPrice,
        inputRange.renewalPrice
    );

    await page.select(
        selectors.voluntaryExcessDropdown,
        inputRange.voluntaryExcess.value
    );

    await page.select(
        selectors.annualMileageDropdown,
        inputRange.annualMileage.value
    );

    // second column
    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.pay.yearly,
            no: selectors.pay.monthly
        },
        inputRange.payFull
    );

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.declinedOrSpecialTerms.yes,
            no: selectors.declinedOrSpecialTerms.no
        },
        inputRange.declinedOrSpecialTerms
    );
}

const coverInfoScrapeOptions = async (page, db, scrapeId, inputRange) => {
    const selectors = {
        coverStartDate: {
            year: '#ctl00_cphBody_qsCoverDetailsFinalPage_qCoverStartDate_tbYYYY',
            month: '#ctl00_cphBody_qsCoverDetailsFinalPage_qCoverStartDate_tbMM',
            day: '#ctl00_cphBody_qsCoverDetailsFinalPage_qCoverStartDate_tbDD'
        },
        renewalPrice: '#ctl00_cphBody_qsCoverDetailsFinalPage_qBestQuote_tbAnswer',
        voluntaryExcessDropdown: '#ctl00_cphBody_qsCoverDetailsFinalPage_qVolExcess_cboAnswer',
        annualMileageDropdown: '#ctl00_cphBody_qsCoverDetailsFinalPage_qTotalAnnualMileage_cboAnswer',
        pay: {
            monthly: '#ctl00_cphBody_qsCoverDetailsFinalPage_qPaymentType_rbAnswer1',
            yearly: '#ctl00_cphBody_qsCoverDetailsFinalPage_qPaymentType_rbAnswer2'
        },
        declinedOrSpecialTerms: {
            yes: '#ctl00_cphBody_qsCoverDetailsFinalPage_qInsuranceDeclined_rbAnswer1',
            no: '#ctl00_cphBody_qsCoverDetailsFinalPage_qInsuranceDeclined_rbAnswer2'
        }
    };

    const typeDate = async (page, selector, plusDays) => {
        const date = new Date;

        date.setDate(date.getDate() + parseInt(plusDays));

        await utils.helpers.typeClean(
            page,
            selector.day,
            date.getDate().toString()
        );

        const month = (parseInt(date.getMonth().toString()) + 1).toString();
        await utils.helpers.typeClean(
            page,
            selector.month,
            month
        );

        await utils.helpers.typeClean(
            page,
            selector.year,
            date.getFullYear().toString()
        );
    }

    // first column
    await typeDate(
        page,
        selectors.coverStartDate,
        inputRange.plusDays
    );

    await utils.helpers.typeClean(
        page,
        selectors.renewalPrice,
        inputRange.renewalPrice
    );

    await page.select(
        selectors.voluntaryExcessDropdown,
        inputRange.voluntaryExcess.value
    );

    await page.select(
        selectors.annualMileageDropdown,
        inputRange.annualMileage.value
    );

    // second column
    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.pay.yearly,
            no: selectors.pay.monthly
        },
        inputRange.payFull
    );

    await utils.helpers.selectYesNo(
        page,
        {
            yes: selectors.declinedOrSpecialTerms.yes,
            no: selectors.declinedOrSpecialTerms.no
        },
        inputRange.declinedOrSpecialTerms
    );

    // options scrape

    const options = {
        coverInfo: {
            plusDays: {
                from: '0',
                to: '30'
            },
            renewalPrice: {
                from: '0',
                to: '2000'
            },
            voluntaryExcess: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.voluntaryExcessDropdown)),
            annualMileage: utils.helpers.removePleaseSelect(await utils.helpers.getOptions(page, selectors.annualMileageDropdown)),
            payFull: [
                true,
                false
            ],
            declinedOrSpecialTerms: [
                true,
                false
            ]
        }
    }

    return options;
}

const coverDetails = async (page, db, dbInstance, scrapeId, continueToNext, scrapeOptions, inputRange) => {
    const selectors = {
        getQuotes: '#ctl00_btnGetMyQuotes',
        noContact: '#ctl00_cphBody_qsHelpingYouComplete_qDoNotContact_rbAnswer2'
    }

    if (scrapeOptions) {
        const coverDetailsOptions = {
            coverInfo: await coverInfoScrapeOptions(
                page,
                db,
                scrapeId,
                inputRange.coverDetails.coverInfo
            )
        };

        await db.saveToDb(
            dbInstance,
            {
                type: 'scrapeOptions',
                data: {
                    scrapeId,
                    name: 'coverDetails',
                    options: coverDetailsOptions
                }
            }
        );
    } else {
        await coverInfo(
            page,
            db,
            scrapeId,
            inputRange.coverDetails.coverInfo
        );
    }

    await page.click(selectors.noContact);

    if (continueToNext) {
        await page.click(selectors.getQuotes);
    }
}

module.exports = coverDetails;
