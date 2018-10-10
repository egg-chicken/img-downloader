const Puppeteer = require('puppeteer');
const PageParser = require('./PageParser');
const ImageDownloader = require('./ImageDownloader');
const Debug = require('./Debug');

class StudyPuppeteer {
  constructor(config) {
    this.downloader = new ImageDownloader(config.name);
    this.parser = new PageParser(config);
    this.config = config;
  }

  async open() {
    this.browser = await Puppeteer.launch({headless: Debug.flag});
    this.page = await this.browser.newPage();
    this.page.setDefaultNavigationTimeout(10000000)
    this.pageForDownload = await this.browser.newPage();
  }

  async goto(url) {
    Debug.log(`goto ${url.toString()}`)
    await this.page.goto(url);
    this.prevUrl = this.currentUrl;
    this.currentUrl = this.page.url();
    Debug.log(`goto completed`)
  }

  async saveImages (){
    Debug.log('saveimages started')
    await this.parser.parse(this.page);
    for(let url of this.parser.imageUrls) {
      Debug.log(`download ${url}`)
      await this.downloader.save(url, this.pageForDownload);
    }
    Debug.log('saveimages completed')
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
