const Puppeteer = require('puppeteer');
const fs = require('fs');
const url = require('url');
const PageParser = require('./PageParser');

class StudyPuppeteer {
  constructor(config) {
    this.config = config;
  }

  async open() {
    this.browser = await Puppeteer.launch();
    this.page = await this.browser.newPage();
  }

  async snap() {
    await this.page.goto(this.config.url);
    await this.page.screenshot({path: 'out/snap.png'});
  }

  async nextSnap() {
    await this.page.click(this.config.next);
    await this.page.waitForNavigation({waitUntil:"networkidle"});
    await this.page.screenshot({path: 'out/nextSnap.png'});
  }

  async saveImages (){
    await this.page.goto(this.config.url);

    const p = new PageParser(this.page);
    await p.findImages();
    const urls = p.imageUrls

    for(let i=0; i<urls.length; i++) {
      const response = await this.page.goto(urls[i]);
      const buffer = await response.buffer();
      const ext = url.parse(response.url).pathname.match('.png|.jpg|.jpeg')
      await fs.writeFile('out/' + i + ext, buffer);
    }
  }

  async close() {
    await this.browser.close();
  }

  static async run(config) {
    const s = new StudyPuppeteer(config);
    await s.open();
    await s.saveImages();
    await s.close();
  }
}

module.exports = StudyPuppeteer;
