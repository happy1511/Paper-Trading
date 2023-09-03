
var express = require('express')
var app = express()
var cors = require('cors')
var port = process.env.PORT || 8000
const {equity,gainers,getEquityHistoricalData, getAllSymbols } = require('./nseapi/allstock') 

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

app.get('/gainers',async (req,res)=>{
    res.send(await gainers())
})

app.get('/equity',async (req,res)=>{
    const data = await equity()
    res.send(data.length)
    console.log(data)
})