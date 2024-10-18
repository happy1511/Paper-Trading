const axios = require("axios");
const UserAgent = require("user-agents");
const { getDateRangeChunks, sleep } = require("./utils");

const ApiList = {
  GLOSSARY: "/api/cmsContent?url=/glossary",
  HOLIDAY_TRADING: "/api/holiday-master?type=trading",
  HOLIDAY_CLEARING: "/api/holiday-master?type=clearing",
  MARKET_STATUS: "/api/marketStatus",
  MARKET_TURNOVER: "/api/market-turnover",
  ALL_INDICES: "/api/allIndices",
  INDEX_NAMES: "/api/index-names",
  CIRCULARS: "/api/circulars",
  LATEST_CIRCULARS: "/api/latest-circular",
  EQUITY_MASTER: "/api/equity-master",
  MARKET_DATA_PRE_OPEN: "/api/market-data-pre-open?key=ALL",
  MERGED_DAILY_REPORTS_CAPITAL: "/api/merged-daily-reports?key=favCapital",
  MERGED_DAILY_REPORTS_DERIVATIVES:
    "/api/merged-daily-reports?key=favDerivatives",
  MERGED_DAILY_REPORTS_DEBT: "/api/merged-daily-reports?key=favDebt",
};

class NseIndia {
  constructor() {
    this.baseUrl = "https://www.nseindia.com";
    this.cookies = "";
    this.userAgent = "";
    this.cookieUsedCount = 0;
    this.cookieMaxAge = 60; // should be in seconds
    this.cookieExpiry = new Date().getTime() + this.cookieMaxAge * 1000;
    this.noOfConnections = 0;
    this.baseHeaders = {
      Referer: "https://www.nseindia.com/get-quotes/equity?symbol=HDFCBANK",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
    };
  }

  async getNseCookies() {
    if (
      this.cookies === "" ||
      this.cookieUsedCount > 10 ||
      this.cookieExpiry <= new Date().getTime()
    ) {
      this.userAgent = new UserAgent().toString();
      const response = await axios.get(
        "https://www.nseindia.com/option-chain",
        {
          headers: { ...this.baseHeaders, "User-Agent": this.userAgent },
        }
      );
      const setCookies = response.headers["set-cookie"];
      const cookies = [];
      setCookies.forEach((cookie) => {
        const cookieKeyValue = cookie.split(";")[0];
        cookies.push(cookieKeyValue);
      });
      this.cookies = cookies.join("; ");
      this.cookieUsedCount = 0;
      this.cookieExpiry = new Date().getTime() + this.cookieMaxAge * 1000;
    }
    this.cookieUsedCount++;
    return this.cookies;
  }

  async getData(url) {
    let retries = 0;
    let hasError = false;
    do {
      while (this.noOfConnections >= 5) {
        await sleep(500);
      }
      this.noOfConnections++;
      try {
        const response = await axios.get(url, {
          headers: {
            ...this.baseHeaders,
            Cookie: await this.getNseCookies(),
            "User-Agent": this.userAgent,
          },
        });
        this.noOfConnections--;
        return response.data;
      } catch (error) {
        hasError = true;
        retries++;
        this.noOfConnections--;
        if (retries >= 10) throw error;
      }
    } while (hasError);
  }

  async getDataByEndpoint(apiEndpoint) {
    return this.getData(`${this.baseUrl}${apiEndpoint}`);
  }

  async getAllStockSymbols() {
    const { data } = await this.getDataByEndpoint(ApiList.MARKET_DATA_PRE_OPEN);
    return data.map((obj) => obj.metadata.symbol).sort();
  }

  getEquityDetails(symbol) {
    return this.getDataByEndpoint(
      `/api/quote-equity?symbol=${encodeURIComponent(symbol.toUpperCase())}`
    );
  }

  getEquityTradeInfo(symbol) {
    return this.getDataByEndpoint(
      `/api/quote-equity?symbol=${encodeURIComponent(
        symbol.toUpperCase()
      )}&section=trade_info`
    );
  }

  getEquityCorporateInfo(symbol) {
    return this.getDataByEndpoint(
      `/api/top-corp-info?symbol=${encodeURIComponent(
        symbol.toUpperCase()
      )}&market=equities`
    );
  }

  async getEquityIntradayData(symbol, isPreOpenData = false) {
    const details = await this.getEquityDetails(symbol.toUpperCase());
    const identifier = details.info.identifier;
    let url = `/api/chart-databyindex?index=${identifier}`;
    if (isPreOpenData) url += "&preopen=true";
    return this.getDataByEndpoint(url);
  }

  async getEquityHistoricalData(symbol, range) {
    const data = await this.getEquityDetails(symbol.toUpperCase());
    const activeSeries = data.info.activeSeries.length
      ? data.info.activeSeries[0]
      : "EQ";
    if (!range) {
      range = { start: new Date(data.metadata.listingDate), end: new Date() };
    }
    const dateRanges = getDateRangeChunks(range.start, range.end, 66);
    const promises = dateRanges.map(async (dateRange) => {
      const url =
        `/api/historical/cm/equity?symbol=${encodeURIComponent(
          symbol.toUpperCase()
        )}` +
        `&series=[%22${activeSeries}%22]&from=${dateRange.start}&to=${dateRange.end}`;
      return this.getDataByEndpoint(url);
    });
    return Promise.all(promises);
  }

  getEquitySeries(symbol) {
    return this.getDataByEndpoint(
      `/api/historical/cm/equity/series?symbol=${encodeURIComponent(
        symbol.toUpperCase()
      )}`
    );
  }

  getEquityStockIndices(index) {
    return this.getDataByEndpoint(
      `/api/equity-stockIndices?index=${encodeURIComponent(
        index.toUpperCase()
      )}`
    );
  }

  getIndexIntradayData(index, isPreOpenData = false) {
    let endpoint = `/api/chart-databyindex?index=${index.toUpperCase()}&indices=true`;
    if (isPreOpenData) endpoint += "&preopen=true";
    return this.getDataByEndpoint(endpoint);
  }

  async getIndexHistoricalData(index, range) {
    const dateRanges = getDateRangeChunks(range.start, range.end, 66);
    const promises = dateRanges.map(async (dateRange) => {
      const url =
        `/api/historical/indicesHistory?indexType=${encodeURIComponent(
          index.toUpperCase()
        )}` + `&from=${dateRange.start}&to=${dateRange.end}`;
      return this.getDataByEndpoint(url);
    });
    return Promise.all(promises);
  }

  getIndexOptionChain(indexSymbol) {
    return this.getDataByEndpoint(
      `/api/option-chain-indices?symbol=${encodeURIComponent(
        indexSymbol.toUpperCase()
      )}`
    );
  }

  getEquityOptionChain(symbol) {
    return this.getDataByEndpoint(
      `/api/option-chain-equities?symbol=${encodeURIComponent(
        symbol.toUpperCase()
      )}`
    );
  }
}

module.exports = NseIndia;
