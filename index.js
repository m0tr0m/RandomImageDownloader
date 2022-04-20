const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const numberOfDownloadedImages = parseInt(process.argv[2]);

const getRandomInteger = () => {
  return Math.floor(Math.random() * 1000) + 1
}

const getLoadingChar = (loadingIndex) => {
  switch (loadingIndex) {
    case 0: return '...'
    case 1: return '....'
    case 2: return '.....'
    case 3: return '....'
    case 4: return '...'
    case 5: return '..'
  }
}

const downloadFiles = async (numberOfDownloadedImages) => {

  process.stdout.write(`\x1B[?25lDownloading ${numberOfDownloadedImages} images from https://picsum.photos ...`)
  process.stdout.write("\n")

  let loadingIndex = 0

  for (let i = 1; i <= numberOfDownloadedImages; i++) {

    fs.mkdirSync('./downloads', { recursive: true });
    const fileName = `image_${i}.jpg`;

    if (!fs.existsSync(`./downloads/${fileName}`)) {
      const localFilePath = path.resolve(__dirname, './downloads', fileName);
      try {
        const response = await axios({
          method: 'GET',
          url: `https://picsum.photos/id/${getRandomInteger()}/1200/600`,
          responseType: 'stream',
        });

        const pipe = response.data.pipe(fs.createWriteStream(localFilePath));
        pipe.on('finish', () => {

          let percent = Math.round(100/numberOfDownloadedImages*i);

          if (process.stdout.clearLine && process.stdout.cursorTo) {
            process.stdout.clearLine(0)
            process.stdout.cursorTo(0)
          }
          process.stdout.write(`===> ${percent}% ${getLoadingChar(loadingIndex)}`)

          if(percent === 100) {
            process.stdout.write(`\nSuccessfully downloaded ${numberOfDownloadedImages} images`)
          }
        });
      } catch (err) {
        i--
      }
    }

    if(loadingIndex === 0) loadingIndex = 1
    else if(loadingIndex === 1) loadingIndex = 2
    else if(loadingIndex === 2) loadingIndex = 3
    else if(loadingIndex === 3) loadingIndex = 4
    else if(loadingIndex === 4) loadingIndex = 5
    else if(loadingIndex === 5) loadingIndex = 0
  }
};

downloadFiles( numberOfDownloadedImages )
