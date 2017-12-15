const Puppeteer = require('puppeteer');
const PageParser = require('./PageParser');
const ImageDownloader = require('./ImageDownloader');

class StudyPuppeteer {
  constructor(config) {
    this.downloader = new ImageDownloader();
    this.parser = new PageParser();
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
    await this.parser.parse(this.page);
    for(let url of this.parser.imageUrls) {
      await this.downloader.save(url, this.page);
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
