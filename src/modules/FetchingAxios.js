import axios from "axios";

const API_URL = "https://stock-wpir.vercel.app";

export const getAllSymbols = () => {
  return axios.get(API_URL + "/getAllSymbols");
};

export const equity = (symbol) => {
  return axios.get(API_URL + `/equity/${symbol}`);
};

export const intraday = (symbol) => {
  return axios.get(API_URL + `/intraday/${symbol}`);
};

export const HistoricalData = (symbol, range) => {
  return axios.get(
    API_URL + `/historical/${symbol}/${range.start}/${range.end}`
  );
};

export const marketstatus = () => {
  return axios.get(API_URL);
};

export const AllTheIndices = () => {
  return axios.get(API_URL + "/Allindices");
};

export const topgainersandloosers = async (indexSymbol) => {
  return axios.get(API_URL + `/gainersandLoosers/${indexSymbol}`);
};

export const mostactive = async (indexSymbol) => {
  return axios.get(API_URL + `/mostactive/${indexSymbol}`);
};
