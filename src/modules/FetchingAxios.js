// ./nseapi/allstock.js
const { default: axios } = require('axios')
var { NseIndia } = require('stock-nse-india')
const nseindia = new NseIndia()
export const getAllSymbols = () => { // Note the corrected function name here
    return nseindia.getAllStockSymbols()
}
export  const getEquityHistoricalData = () => {
    return nseindia.getEquityStockIndices('NIFTY50')
}


export  const equity = (symbol) => {
    return nseindia.getEquityDetails(symbol)
}


export  const intraday = (symbol) => {
    return nseindia.getEquityIntradayData(symbol, false)
}

export  const HistoricalData = (symbol, range) => {
    return nseindia.getEquityHistoricalData(symbol, range)
}

export const marketstatus = () => {
    console.log(nseindia.getAllStockSymbols());
    return nseindia.getDataByEndpoint('/api/marketStatus')
}

export  const AllTheIndices = () => {
    return nseindia.getDataByEndpoint('/api/allIndices')
}

export  const topgainersandloosers =async (indexSymbol) => {
    const indexData = await nseindia.getEquityStockIndices(indexSymbol);
    const gainers = [];
    const losers = [];
    indexData.data.forEach((equityInfo) => {
        if (equityInfo.pChange > 0)
            gainers.push(equityInfo);
        else
            losers.push(equityInfo);
    });
    return {
        gainers: [...gainers].sort((a, b) => b.pChange - a.pChange),
        losers: [...losers].sort((a, b) => a.pChange - b.pChange)
    };
}

export  const mostactive = async (indexSymbol) => {
    const indexData = await nseindia.getEquityStockIndices(indexSymbol);
    return {
        byVolume: [...indexData.data].sort((a, b) => b.totalTradedVolume - a.totalTradedVolume),
        byValue: [...indexData.data].sort((a, b) => b.totalTradedValue - a.totalTradedValue)
    };
}