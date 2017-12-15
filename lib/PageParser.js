class PageParser {
  constructor(page) {
    this.page = page;
  }

  async parse(){
      await this.findImages();
  }

  async findImages() {
    this.imageUrls = await this.page.evaluate(() => {
      return [].map.call(document.querySelectorAll('img'), (el) => el.src);
    });
  }
}

module.exports = PageParser;
