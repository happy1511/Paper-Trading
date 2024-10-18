// ./nseapi/allstock.js
const { default: axios } = require("axios");
const Nseindia = require("./nse.js");
const nseindia = new Nseindia();
exports.getAllSymbols = () => {
  return nseindia.getAllStockSymbols();
};
exports.getEquityHistoricalData = () => {
  return nseindia.getEquityStockIndices("NIFTY50");
};

exports.equity = (symbol) => {
  return nseindia.getEquityDetails(symbol);
};

exports.news = async () => {
  try {
    var apiKey = "aa645100abd64084b8f46be432b080b7"; // Replace with your NewsAPI API key
    var apiUrl = "https://newsapi.org/v2/top-headlines?country=in";
    var { data } = await axios.get(apiUrl, {
      params: {
        apiKey,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    return { error: "Internal Server Error" };
  }
};

exports.intraday = (symbol) => {
  return nseindia.getEquityIntradayData(symbol, false);
};

exports.HistoricalData = (symbol, range) => {
  return nseindia.getEquityHistoricalData(symbol, range);
};

exports.marketstatus = () => {
  return nseindia.getDataByEndpoint("/api/marketStatus");
};

exports.AllTheIndices = () => {
  return nseindia.getDataByEndpoint("/api/allIndices");
};

exports.topgainersandloosers = async (indexSymbol) => {
  const indexData = await nseindia.getEquityStockIndices(indexSymbol);
  const gainers = [];
  const losers = [];
  indexData.data.forEach((equityInfo) => {
    if (equityInfo.pChange > 0) gainers.push(equityInfo);
    else losers.push(equityInfo);
  });
  return {
    gainers: [...gainers].sort((a, b) => b.pChange - a.pChange),
    losers: [...losers].sort((a, b) => a.pChange - b.pChange),
  };
};

exports.mostactive = async (indexSymbol) => {
  const indexData = await nseindia.getEquityStockIndices(indexSymbol);
  return {
    byVolume: [...indexData.data].sort(
      (a, b) => b.totalTradedVolume - a.totalTradedVolume
    ),
    byValue: [...indexData.data].sort(
      (a, b) => b.totalTradedValue - a.totalTradedValue
    ),
  };
};
