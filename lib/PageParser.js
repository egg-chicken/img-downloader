class PageParser {
  constructor(config){
    this.nextSelector = config.next;
  }

  async parse(page){
    this.page = page;
    await this.findImages();
    await this.findNext();
  }

  async findImages() {
    this.imageUrls = await this.page.evaluate(() => {
      return [].map.call(document.querySelectorAll('img'), (el) => el.src);
    });
  }

  async findNext() {
    this.nextUrl = await this.page.evaluate((selector) => {
      return document.querySelector(selector).href;
    }, this.nextSelector);
  }
}

module.exports = PageParser;
