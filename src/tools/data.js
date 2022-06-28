require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');

const tabName = 'Ethels';
const sheetId = process.env.SHEET_ID;
const key = process.env.API_KEY;

const getData = async () => {
  const response = await axios(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${tabName}?alt=json&key=${key}`);
  return response.data.values;
};

const main = async () => {
  const data = await getData();

  // Map the data to a new object
  const mapped = data.map((row) => ({
    id: row[0],
    slug: row[1],
    name: row[2],
    gridreference: row[3],
    image: row[4],
    image_attribute: row[5],
    height: row[6],
    prominence: row[7],
    lat: row[8],
    lon: row[9],
    county: row[10],
    easy: row[11],
    moderate: row[12],
    hard: row[13],
  }));

  // Remove first item from array
  mapped.shift();

  // Write to file
  const json = JSON.stringify(mapped, null, 4);
  fs.writeFileSync('./src/data/ethels.json', json);
  console.log('Data written to file');
};

main();
