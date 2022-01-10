const express = require('express')
var cors = require('cors')
require('dotenv').config()
const path = require('path')
const PORT = process.env.PORT || 5000
const fs = require('fs');
const countriesLines = JSON.parse(fs.readFileSync('countries.json'));

let countriesMap = new Map();
let countries = [];
let regionsMap = new Map();
let regions = [];
let subregions = [];
for (let country of countriesLines) {
  countriesMap.set(country.cca3.toLowerCase(), country)
  countries.push({...country, abbr: country.cca3.toLowerCase()})
  if (!regionsMap.has(country.region)) {
    regionsMap.set(country.region, new Set())
    regions.push(country.region);
  }
  if (country.subregion) {
    regionsMap.get(country.region).add(country.subregion)
  }
}
regionsMap.forEach((value, key) => {
  regionsMap.set(key, [...value])
  value.forEach((sub) => {
    subregions.push({ sup: key, name: sub })
  })
})

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({ origin: '*' }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/regions', (req, res) => res.status(200).send(regions))
  .get('/subregions', (req, res) => res.status(200).send(subregions))
  .get('/countries', (req, res) => res.status(200).send(countries))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
