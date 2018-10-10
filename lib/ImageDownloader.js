const fs = require('fs');
const url = require('url');
const Debug = require('./Debug');
const EXPORT_DIR = "out";
const MINIMUM_LENGTH = 1024 * 100;

class ImageDownloader {
  constructor(directory_name) {
    this.count = 0;
    this.export_path = EXPORT_DIR + "/" + directory_name.replace(/\//g, " ") + "/";

    if (!fs.existsSync(this.export_path)){
      fs.mkdirSync(this.export_path);
    }
  }

  async save(path, page) {
    Debug.log(`goto ${path}`)
    const response = await page.goto(path);
    Debug.log(`get the response`)
    const buffer = await response.buffer();
    Debug.log(`build the image name`)
    const name = this.buildName(response.url());

    if(name && buffer.length > MINIMUM_LENGTH) {
      Debug.log('write it')
      fs.writeFileSync(this.export_path + name, buffer);
      this.count += 1;
    }
  }

  buildName(uri){
    Debug.log(`parse ${uri}`)
    const pathname = url.parse(uri).pathname
    if(pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')){
      return pathname.match("[^/]*$");
    }
  }
}

module.exports = ImageDownloader;
