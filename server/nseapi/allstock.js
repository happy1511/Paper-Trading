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
    gainers.sort((a, b) => b.pChange - a.pChange)
    Loosers.sort((a, b) => a.pChange - b.pChange)
    return { Loosers: [...Loosers], Gainers: [...gainers] }
}


exports.endpo = async ()=>{
   return await nseindia.getDataByEndpoint('/api/gainersAndLosers/nifty50')
}

exports.intraday = (symbol) => {
    return nseindia.getEquityIntradayData(symbol,false)
}