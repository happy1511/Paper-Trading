
var express = require('express')
var app = express()
var cors = require('cors')
var port = process.env.PORT || 8000
const { mostactive,topgainersandloosers, AllTheIndices, HistoricalData, intraday,news, equity, gainers, getEquityHistoricalData, getAllSymbols, marketstatus } = require('./nseapi/allstock')

app.use(cors())

app.get('/', async (req, res) => {
    res.json(await marketstatus())
});


app.get('/getAllSymbols', async (req, res) => {
    res.send(await getAllSymbols())
})


app.get('/gainersandLoosers/:symbol', async (req, res) => {
    res.json(await topgainersandloosers(req.params.symbol))
})

app.get('/equity/:symbol', async (req, res) => {
    res.send(await equity(req.params.symbol))
})

app.get('/news', async (req, res) => {
    res.send(await news())
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

app.get('/Allindices', async (req, res) => {
    res.json(await AllTheIndices())
})

app.get('/mostactive/:indexsymbol',async (req,res) => {
    res.json(await mostactive(req.params.indexsymbol))
})

app.listen(port, () => {
    console.log(`server is listening port ${port}`)
})
