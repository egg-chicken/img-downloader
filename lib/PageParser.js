class PageParser {
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
    this.nextUrl = await this.page.evaluate(() => {
      return document.querySelector('#next').href;
    });
  }
}

module.exports = PageParser;
