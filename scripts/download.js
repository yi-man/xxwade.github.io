"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var https = require("https");
function saveImageToDisk(url, localPath) {
    var fullUrl = url;
    var file = fs.createWriteStream(localPath);
    var request = https.get(url, function (response) {
        response.pipe(file);
    });
}
function findImageAndRepalce() {
    var postDir = path.resolve('./_posts');
    var dirInfo = fs.readdirSync(postDir);
    for (var _i = 0, dirInfo_1 = dirInfo; _i < dirInfo_1.length; _i++) {
        var file = dirInfo_1[_i];
        var matches = file.match(/^(\d{4}-\d{2}-\d{2})/);
        if (matches) {
            var date = matches[1];
            var articleName = file.substr(11).split('.')[0];
            var fileConent = fs.readFileSync(postDir + "/" + file).toString();
            var images = fileConent.match(/(\(https:\/\/cdn.nlark.com[^)]+\))/g);
            if (images) {
                for (var i = 0; i < images.length; i++) {
                    var image = images[i];
                    image = image.substr(1, image.length - 2);
                    var imageDir = date.replace(/-/g, '').substr(0, 6);
                    imageDir = "./assets/images/" + imageDir;
                    if (!fs.existsSync(imageDir)) {
                        fs.mkdirSync(imageDir);
                    }
                    saveImageToDisk(image, imageDir + "/" + articleName + i + ".png");
                    fileConent = fileConent.replace(image, (imageDir + "/" + articleName + i + ".png").substr(1));
                }
            }
            fs.writeFileSync(postDir + "/" + file, fileConent);
        }
    }
}
findImageAndRepalce();
// saveImageToDisk(
//   'https://cdn.nlark.com/yuque/0/2020/png/117224/1590411991678-e334c62e-6a4f-4b1d-84b7-d3a32a32a7dc.png#align=left&display=inline&height=526&margin=%5Bobject%20Object%5D&name=image.png&originHeight=526&originWidth=2068&size=60157&status=done&style=none&width=2068',
//   './1.png')
