const Debug = require('./Debug');

class PageParser {
  constructor(config){
    this.nextSelector = config.next_selector;
    this.nameSelector = config.name_selector;
  }

  async parse(page){
    this.page = page;
    await this.findName()
    await this.findImages();
    await this.findNext();
  }

  async findName() {
    Debug.log(`findname with ${this.nameSelector}`)
    this.name = await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return element ? element.innerText : document.title;
    }, this.nameSelector);
    Debug.log(this.name)
  }

  async findImages() {
    Debug.log("findimages")
    this.imageUrls = await this.page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      const array = [];
      for(let img of imgs){
        if(img.height > 100 && img.width > 100)
        array.push(img.src);
      }
      return array;
    });
    Debug.log(this.imageUrls)
  }

  async findNext() {
    Debug.log(`findnext with ${this.nextSelector}`)
    this.nextUrl = await this.page.evaluate((selector) => {
      return document.querySelector(selector).href;
    }, this.nextSelector);
    Debug.log(this.nextUrl)
  }
}

module.exports = PageParser;
