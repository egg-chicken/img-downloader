const Puppeteer = require('puppeteer')
const PageParser = require('./PageParser')
const ImageDownloader = require('./ImageDownloader')
const Debug = require('./Debug')

class Browser {
  async open() {
    this.pupeteerBrowser = await Puppeteer.launch({headless: !Debug.flag})
    this.pageForNavigation = await this.pupeteerBrowser.newPage()
    this.pageForNavigation.setDefaultNavigationTimeout(10000000)
    this.pageForDownload = await this.pupeteerBrowser.newPage()
  }

  async setup(config) {
    Debug.log('setup')

    this.config = config
    this.parser = new PageParser(config)

    await this.goto(config.url)
    await this.parser.parse(this.pageForNavigation)

    this.downloader = new ImageDownloader(this.getName())
  }

  async run(config) {
    while(true){
      await this.saveImages()
      await this.goto(this.parser.nextUrl)
      if (this.prevUrl == this.currentUrl) { break }
    }
  }

  async close() {
    Debug.log('close')
    await this.pupeteerBrowser.close()
  }

  getName () {
    return this.config.name || this.parser.name
  }

  //private

  async goto(url) {
    Debug.log(`goto ${url.toString()}`)
    await this.pageForNavigation.goto(url)
    this.prevUrl = this.currentUrl
    this.currentUrl = this.pageForNavigation.url()
    Debug.log(`goto completed`)
  }

  async saveImages (){
    Debug.log('saveimages started')
    await this.parser.parse(this.pageForNavigation)
    for(let url of this.parser.imageUrls) {
      Debug.log(`download ${url}`)
      await this.downloader.save(url, this.pageForDownload)
    }
    Debug.log('saveimages completed')
  }
}

module.exports = Browser
