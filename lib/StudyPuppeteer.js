const Puppeteer = require('puppeteer');
const PageParser = require('./PageParser');
const ImageDownloader = require('./ImageDownloader');
const Debug = require('./Debug');

class StudyPuppeteer {
  async open() {
    this.browser = await Puppeteer.launch({headless: !Debug.flag});
    this.page = await this.browser.newPage();
    this.page.setDefaultNavigationTimeout(10000000)
    this.pageForDownload = await this.browser.newPage();
  }

  async setup(config) {
    Debug.log('setup')

    this.config = config;
    this.parser = new PageParser(config);

    await this.goto(config.url)
    await this.parser.parse(this.page)

    this.downloader = new ImageDownloader(this.getName())
  }

  async run(config) {
    while(true){
      await this.saveImages();
      await this.goto(this.parser.nextUrl);
      if (this.prevUrl == this.currentUrl) { break; }
    }
  }

  async close() {
    Debug.log('close')
    await this.browser.close()
  }

  getName () {
    return this.config.name || this.parser.name
  }

  //private

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
}

module.exports = StudyPuppeteer;
