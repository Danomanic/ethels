const sharp = require('sharp');

const imageFolder = './src/public/images/ethels';
const fs = require('fs');

fs.readdirSync(imageFolder).forEach((file) => {
  if (file.endsWith('.jpg')) {
    const newFileName = file.replace('.jpg', '');
    sharp(`${imageFolder}/${file}`).resize(1024, 400).webp({
      lossless: true, quality: 60, alphaQuality: 80, force: false,
    }).toFile(`${imageFolder}/headers/${newFileName}.webp`)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => {
        console.log(err);
      });
    sharp(`${imageFolder}/${file}`).resize(580, 460).webp({
      lossless: true, quality: 60, alphaQuality: 80, force: false,
    }).toFile(`${imageFolder}/thumbnails/${newFileName}.webp`)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => {
        console.log(err);
      });
    sharp(`${imageFolder}/${file}`).resize(50, 50).webp({
      lossless: true, quality: 60, alphaQuality: 80, force: false,
    }).toFile(`${imageFolder}/map/${newFileName}.webp`)
      .then((info) => {
        console.log(info);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(`Processing ${file}`);
  }
});
