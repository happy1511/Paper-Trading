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

exports.news = async () => {
    console.log('ok')
    await axios.get('https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=aa645100abd64084b8f46be432b080b7').then(res => {
        return res
    }).catch(err => {
        return err
    })
}