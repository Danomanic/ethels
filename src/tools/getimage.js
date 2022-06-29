const axios = require('axios').default;
const fs = require('fs');
const ethels = require('../data/ethels.json');

const getImageList = async (gridRef) => {
  const response = await axios(`https://api.geograph.org.uk/syndicator.php?key=ethel.uk&q=${gridRef}&format=JSON`);
  return response.data.items;
};

const getImageData = async (id) => {
  const response = await axios(`https://api.geograph.org.uk/api/photo/${id}/ethels.uk?format=json`);
  return response.data;
};

const pickBestImage = async (images) => {
  let chosenImage;
  for (let i = 0; i < images.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const imageData = await getImageData(images[i].guid);

    // If sizeInfo array has a value, then we have a valid image
    for (let j = 0; j < imageData.sizeinfo.length; j++) {
      if (parseInt(imageData.sizeinfo[j], 10) > 1024) {
        chosenImage = imageData;
        break;
      }
    }
    if (chosenImage) {
      break;
    }
  }
  return chosenImage;
};

const getImageNameData = async (chosenImage) => {
  // Split the image URL into an array
  const imageUrl = chosenImage.image.split('/');

  // Get the image name
  const imageName = imageUrl[imageUrl.length - 1];

  // Remove extension from image name
  const imageNameNoExt = imageName.split('.')[0];

  // Split image name into an array
  const imageNameArray = imageNameNoExt.split('_');
  return imageNameArray;
};

const main = async () => {
  // For each ethel in the ethels array
  for (let i = 0; i < ethels.length; i++) {
    const imageName = ethels[i].slug;
    const gridRef = ethels[i].gridreference;
    const data = await getImageList(gridRef);
    const chosenImage = await pickBestImage(data);
    const imageNameArray = await getImageNameData(chosenImage);

    // Use axios to download the image
    const response = await axios.get(`https://www.geograph.org.uk/reuse.php?id=${imageNameArray[0]}&download=${imageNameArray[1]}&size=original`, { responseType: 'arraybuffer' });

    // Write the image to a file
    await fs.writeFileSync(`./src/public/images/ethels/${imageName}.jpg`, response.data);
    ethels[i].image_attribute = `Photo ©&nbsp;<a href="https://www.geograph.org.uk${chosenImage.profile_link}" title="View profile">${chosenImage.realname}</a> (<a href="http://creativecommons.org/licenses/by-sa/2.0/">cc-by-sa/2.0</a>)`;
    ethels[i].image = `${imageName}.webp`;
    console.log(ethels[i].image_attribute);
    console.log(`Processed ${imageName}`);
  }

  // Write the ethels array to the ethels.json file
  await fs.writeFileSync('./src/data/ethels.json', JSON.stringify(ethels, null, 4));
};

main();
