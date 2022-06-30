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
    image_header_fit: row[6],
    image_header_position: row[7],
    height: row[8],
    prominence: row[9],
    lat: row[10],
    lon: row[11],
    county: row[12],
    easy: row[13],
    moderate: row[14],
    hard: row[15],
  }));

  // Remove first item from array
  mapped.shift();

  // Write to file
  const json = JSON.stringify(mapped, null, 4);
  fs.writeFileSync('./src/data/ethels.json', json);
  console.log('Data written to file');
};

main();
