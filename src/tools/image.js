const sharp = require('sharp');
const fs = require('fs');
const ethels = require('../data/ethels.json');

const imageFolder = './src/public/images/ethels';

const renderHeader = async (ethel, file) => {
  console.log(`${ethel.name} : (${ethel.image_header_fit}, ${ethel.image_header_position})`);
  await sharp(`${imageFolder}/${file}`).resize(
    1024,
    400,
    {
      fit: ethel.image_header_fit,
      position: ethel.image_header_position,
    },
  ).webp({
    lossless: true, quality: 60, alphaQuality: 80, force: false,
  }).toFile(`${imageFolder}/headers/${ethel.image}`)
    .then((info) => {
      console.log(info);
    })
    .catch((err) => {
      console.log(err);
    });
};

const renderAll = async () => {
  console.log('Rendering all ethels');
  fs.readdirSync(imageFolder).forEach(async (file) => {
    if (file.endsWith('.jpg')) {
      const newFileName = file.replace('.jpg', '');
      const ethel = ethels.find((o) => o.slug === newFileName);

      await renderHeader(ethel, file);
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
};

const renderOne = async (slug) => {
  console.log(`Rendering ${slug}`);
  const ethel = ethels.find((o) => o.slug === slug);
  await renderHeader(ethel, `${ethel.slug}.jpg`);
};

const main = async () => {
  const myArgs = process.argv.slice(2);
  if (myArgs.length === 0) {
    await renderAll();
  } else {
    await renderOne(myArgs[0]);
  }
};

main();
