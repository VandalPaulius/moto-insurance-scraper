// optional config to narrow bike option scraping
module.exports = {
    bikeMakerScrapeCap: 5,
    manufactureYear: {
        from: '2014',
        to: '2015'
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