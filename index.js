const express = require("express");
var cors = require("cors");
require("dotenv").config();
const serveStatic = require("serve-static");
const path = require("path");
const PORT = process.env.PORT || 5000;
const fs = require("fs");
const countriesLines = JSON.parse(fs.readFileSync("countries.json"));

let countriesMap = new Map();
let countries = [];
let regionsMap = new Map();
let regions = [];
let subregions = [];
for (let country of countriesLines) {
  countriesMap.set(country.cca3.toLowerCase(), country);
  countries.push({ ...country, abbr: country.cca3.toLowerCase() });
  if (!regionsMap.has(country.region)) {
    regionsMap.set(country.region, new Set());
    regions.push(country.region);
  }
  if (country.subregion) {
    regionsMap.get(country.region).add(country.subregion);
  }
}
regionsMap.forEach((value, key) => {
  regionsMap.set(key, [...value]);
  value.forEach((sub) => {
    subregions.push({ sup: key, name: sub });
  });
});

const app = express();

app.get("/favicon.ico", function (req, res) {
  res.sendFile(path.join(__dirname, "./favicon.ico"));
});

app
  .use(cors({ origin: "*" }))
  .get("/regions", (req, res) => res.status(200).send(regions))
  .get("/subregions", (req, res) => res.status(200).send(subregions))
  .get("/countries", (req, res) => res.status(200).send(countries))
  .get("/*", (req,res)=>{res.sendFile(path.join(__dirname, "./dist/index.html"))})
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
