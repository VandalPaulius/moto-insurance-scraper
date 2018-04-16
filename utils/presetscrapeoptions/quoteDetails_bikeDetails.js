// optional config to narrow bike option scraping
module.exports = {
    bikeMakerScrapeCap: 5,
    //bikeMakerScrapeCap: null,
    manufactureYear: {
        from: '2014',
        to: '2018'
    },
    engineSize: {
        isElectric: [
            true,
            false
        ],
        engineCC: {
            from: '110',
            to: '160'
        }
    }
}