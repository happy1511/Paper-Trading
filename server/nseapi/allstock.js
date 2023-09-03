// ./nseapi/allstock.js

var { NseIndia } = require('stock-nse-india')
const nseindia = new NseIndia()

exports.getAllSymbols = () => { // Note the corrected function name here
    return nseindia.getAllStockSymbols()
}
exports.getEquityHistoricalData = () => {
    return nseindia.getEquityStockIndices('NIFTY50')
}