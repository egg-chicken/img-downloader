class PageParser {
  constructor(config){
    this.nextSelector = config.next;
    this.debugFlag = true;
  }

  debug(text){
    if(this.debugFlag) { console.log(text) }
  }

  async parse(page){
    this.page = page;
    await this.findImages();
    await this.findNext();
  }

  async findImages() {
    this.debug("findimages")
    this.imageUrls = await this.page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      const array = [];
      for(let img of imgs){
        if(img.height > 100 && img.width > 100)
        array.push(img.src);
      }
      return array;
    });
    this.debug(this.imageUrls)
  }

  async findNext() {
    this.debug("findnext")
    this.nextUrl = await this.page.evaluate((selector) => {
      return document.querySelector(selector).href;
    }, this.nextSelector);
    this.debug(this.nextUrl)
  }
}

module.exports = PageParser;
