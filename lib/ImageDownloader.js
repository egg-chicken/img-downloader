const fs = require('fs');
const url = require('url');

const EXPORT_DIR = "out/";

class ImageDownloader {
  constructor() {
    this.count = 0;
  }

  async save(path, page) {
    const response = await page.goto(path);
    const buffer = await response.buffer();
    const name = this.buildName(response.url);
    if(name) {
      await fs.writeFile(EXPORT_DIR + name, buffer);
      this.count += 1;
    }
  }

  buildName(uri){
    const pathname = url.parse(uri).pathname
    if(pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')){
      return pathname.match("[^/]*$");
    }
  }
}

module.exports = ImageDownloader;
