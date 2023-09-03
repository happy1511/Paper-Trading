
var express = require('express')
var app = express()
var port = 3001
const { getAllSymbols } = require('./nseapi/allstock') 

app.get('/', (req, res) => {
    res.send("hello world")
});

app.listen(port, () => {
    console.log(`server is listening port ${port}`)
})

app.get('/getAllSymbols', async (req, res) => {
    res.send(await getAllSymbols())
})
