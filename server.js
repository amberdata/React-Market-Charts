const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path');
const port = process.env.PORT || 3001
// require('dotenv').config()

const allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET')
	res.header('Access-Control-Allow-Headers', 'x-api-key')
	next()
}

app.use(allowCrossDomain)
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/tokenPrices', async (req, res) => {
  const address = req.query.address
  const apiKey = req.get('x-api-key') || process.env.APIKEY
  try {
    const response = await axios.get(`https://web3api.io/api/v1/market/tokens/prices/${address}/historical?timeFormat=ms&timeInterval=d`, { headers: { 'x-api-key': apiKey }})
    const data = response.data.payload.data
    const result = []
    data.forEach(item => {
      result.push([item[0], item[1]])
    })
    res.send(result)
  } catch (err) {
    console.log('err', err)
    res.status(500).send(err)
  }
})

app.get('/totalSupply', async (req, res) => {
  const address = req.query.address
  const apiKey = req.get('x-api-key') || process.env.APIKEY
  try {
    const response = await axios.get(`https://web3api.io/api/v1/tokens/${address}/supplies/historical?timeFormat=ms&timeFrame=30d`, { headers: { 'x-api-key': apiKey }})
    const data = response.data.payload.data
    const result = []
    data.forEach(item => {
      result.push([item[0], item[3]])
    })
    res.send(result)
  } catch (err) {
    console.log('err', err)
    res.status(500).send(err)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
