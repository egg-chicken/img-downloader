const Puppeteer = require('puppeteer');
const PageParser = require('./PageParser');
const ImageDownloader = require('./ImageDownloader');

class StudyPuppeteer {
  constructor(config) {
    this.downloader = new ImageDownloader(config.name);
    this.parser = new PageParser(config);
    this.config = config;
  }

  async open() {
    this.browser = await Puppeteer.launch();
    this.page = await this.browser.newPage();
    this.pageForDownload = await this.browser.newPage();
  }

  async goto(url) {
    await this.page.goto(url);
    this.prevUrl = this.currentUrl;
    this.currentUrl = this.page.url();
  }

  async saveImages (){
    await this.parser.parse(this.page);
    for(let url of this.parser.imageUrls) {
      await this.downloader.save(url, this.pageForDownload);
    }
  }

  async close() {
    await this.browser.close();
  }

  static async run(config) {
    const s = new StudyPuppeteer(config);

    try {
      await s.open();
      await s.goto(config.url);
      while(true){
        console.log(s.currentUrl);
        await s.saveImages();
        await s.goto(s.parser.nextUrl);
        if (s.prevUrl == s.currentUrl) { break; }
      }
    } finally {
      await s.close();
    }
  }
}

module.exports = StudyPuppeteer;
