
var express = require('express')
var app = express()
var port = process.env.PORT || 3001
const {getEquityHistoricalData, getAllSymbols } = require('./nseapi/allstock') 

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