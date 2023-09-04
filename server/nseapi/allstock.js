// ./nseapi/allstock.js
const { default: axios } = require('axios')
var { NseIndia } = require('stock-nse-india')
const nseindia = new NseIndia()

exports.getAllSymbols = () => { // Note the corrected function name here
    return nseindia.getAllStockSymbols()
}
exports.getEquityHistoricalData = () => {
    return nseindia.getEquityStockIndices('NIFTY50')
}

exports.news = () => {
    axios.get('https://hi-imcodeman.github.io/stock-nse-india/modules/helpers.html#getgainersandlosersbyindex').then(res => {
        return res
    }).catch(err => {
        return err
    })
}

exports.equity = (symbol) => {
    return nseindia.getEquityDetails(symbol)
}

exports.gainers = async () => {
    const allSymbols = await this.getAllSymbols()
    const gainers = []
    const Loosers = []
    for (let symbol = 0; symbol < allSymbols.length; symbol++) {

        const element = allSymbols[symbol];
        var data = await this.equity(element)
        if (data.pChange > 0) {
            gainers.push(data)
        }
        else {
            Loosers.push(data)
        }
    }
    gainers.sort((a, b) => b.priceInfo.pChange - a.priceInfo.pChange)
    Loosers.sort((a, b) => a.priceInfo.pChange - b.priceInfo.pChange)
    return { Loosers: [...Loosers], Gainers: [...gainers] }
}


exports.endpo = async () => {
    try {
        var apiKey = 'aa645100abd64084b8f46be432b080b7'; // Replace with your NewsAPI API key
        var apiUrl = 'https://newsapi.org/v2/top-headlines?country=us';
        var { data } = await axios.get(apiUrl, {
            params: {
                apiKey,
            },
        });

       return (data);
    } catch (error) {
        console.error(error);
        return ({ error: 'Internal Server Error' });
    }
};



exports.intraday = (symbol) => {
    return nseindia.getEquityIntradayData(symbol, false)
}

exports.HistoricalData = (symbol, range) => {
    return nseindia.getEquityHistoricalData(symbol, range)
}

// exports.data = ()=>{
//     return nseindia.getDataByEndpoint('/top-gainers-loosers')
// }

exports.marketstatus = () => {
    return nseindia.getDataByEndpoint('/api/marketStatus')
}

exports.AllTheIndices = () => {
    return nseindia.getDataByEndpoint('/api/allIndices')
}