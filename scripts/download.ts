import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

function saveImageToDisk(url: string, localPath: string) {
  var fullUrl = url;
  var file = fs.createWriteStream(localPath);
  var request = https.get(url, function(response) {
    response.pipe(file);
  });
}

function findImageAndRepalce() {
  const postDir = path.resolve('./_posts');

  const dirInfo = fs.readdirSync(postDir);

  for(let file of dirInfo) {
    const matches = file.match(/^(\d{4}-\d{2}-\d{2})/)

    if (matches) {
      const date = matches[1];
      const articleName = file.substr(11).split('.')[0];

      let fileConent = fs.readFileSync(`${postDir}/${file}`).toString();
      const images = fileConent.match(/(\(https:\/\/cdn.nlark.com[^)]+\))/g);

      if (images) {
        for (let i = 0; i < images.length; i++) {
          let image = images[i];
          image = image.substr(1, image.length - 2)

          let imageDir = date.replace(/-/g, '').substr(0, 6)
          imageDir = `./assets/images/${imageDir}`;

          if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir);
          }

          saveImageToDisk(image, `${imageDir}/${articleName}${i}.png`);

          fileConent = fileConent.replace(image, `${imageDir}/${articleName}${i}.png`.substr(1))
        }
      }

      fs.writeFileSync(`${postDir}/${file}`, fileConent);
    }
  }
}

findImageAndRepalce();

// saveImageToDisk(
//   'https://cdn.nlark.com/yuque/0/2020/png/117224/1590411991678-e334c62e-6a4f-4b1d-84b7-d3a32a32a7dc.png#align=left&display=inline&height=526&margin=%5Bobject%20Object%5D&name=image.png&originHeight=526&originWidth=2068&size=60157&status=done&style=none&width=2068',
//   './1.png')
