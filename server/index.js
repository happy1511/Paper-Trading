
var express = require('express')
var app = express()
var cors = require('cors')
var port = process.env.PORT || 8000
const { HistoricalData, intraday, endpo, equity, gainers, getEquityHistoricalData, getAllSymbols } = require('./nseapi/allstock')

app.use(cors())

app.get('/', (req, res) => {
    res.send("hello world")
});

app.listen(port, () => {
    console.log(`server is listening port ${port}`)
})

app.get('/getAllSymbols', async (req, res) => {
    res.send(await getAllSymbols())
})

app.get('/ADANIENT', async (req, res) => {
    res.send(await getEquityHistoricalData())
})

app.get('/gainers', async (req, res) => {
    res.send(await gainers())
})

app.get('/equity/:symbol', async (req, res) => {
    res.send(await equity(req.params.symbol))
})

app.get('/news', async (req, res) => {
    res.send(await endpo())
})

app.get('/intraday/:symbol', async (req, res) => {
    res.send(await intraday(req.params.symbol))
})

function increaseTimeout(req, res, next) {
    req.setTimeout(180000);
    next();
}

app.get('/historical/:symbol/:start/:end', increaseTimeout, async (req, res) => {
    res.send(await HistoricalData(req.params.symbol, {
        start: new Date(req.params.start),
        end: new Date(req.params.end)
    }))
})