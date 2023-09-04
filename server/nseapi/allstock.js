// ./nseapi/allstock.js
const { default: axios } = require('axios')
var { NseIndia } = require('stock-nse-india')
const nseindia = new NseIndia()
const cheerio = require('cheerio');

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
    // const allSymbols = await this.getAllSymbols()
    // const gainers = []
    // const Loosers = []
    // for (let symbol = 0; symbol < allSymbols.length; symbol++) {

    //     const element = allSymbols[symbol];
    //     var data = await this.equity(element)
    //     if (data.pChange > 0) {
    //         gainers.push(data)
    //     }
    //     else {
    //         Loosers.push(data)
    //     }
    // }
    // gainers.sort((a, b) => b.priceInfo.pChange - a.priceInfo.pChange)
    // Loosers.sort((a, b) => a.priceInfo.pChange - b.priceInfo.pChange)
    // return { Loosers: [...Loosers], Gainers: [...gainers] }
    const url = 'https://www.nseindia.com/market-data/top-gainers-loosers#losers';

    // Set headers to mimic a web browser request
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    };

    // Make an HTTP GET request to the website
    axios.get(url, { headers })
        .then(response => {
            // Load the HTML content into Cheerio
            const $ = cheerio.load(response.data);

            // Find the table with the ID "topGainers"
            const topLosersTable = $('#topgainer-Table');

            // Check if the table was found
            if (topLosersTable.length > 0) {
                // Extract data from the table (example: extracting the first row)
                const firstRowData = topLosersTable.find('tbody tr:first-child td a').map(function () {
                    return $(this).text().trim();
                }).get();

                // Print the extracted data
                return firstRowData
                console.log('Data from the first row:', firstRowData);
            } else {
                return 'notfound'
                console.log('Table with ID "topLosers" not found on the page.');
            }
        })
        .catch(error => {
            console.error('Error:', error);

            return error
        });

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

exports.topgainersandloosers =async () => {
    const allSymbols =await nseindia.getAllStockSymbols()
    var equity = []
    for (var i = 0; i < allSymbols.length; i++) {
        var equitydata =await nseindia.getEquityDetails(allSymbols[i]);
        equity.push(equitydata)
    }
    return equity.sort((a,b) => {a.priceInfo.pChange - b.priceInfo.pChange})
}
