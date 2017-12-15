const fs = require('fs');
const url = require('url');
const sprintf = require('sprintf');

class ImageDownloader {
  constructor() {
    this.count = 0;
  }

  async save(path, page) {
    const response = await page.goto(path);
    const buffer = await response.buffer();
    const ext = url.parse(response.url).pathname.match('.png|.jpg|.jpeg')
    await fs.writeFile('out/' + sprintf("%04d", this.count) + ext, buffer);
    this.count += 1;
  }
}

module.exports = ImageDownloader;
