class PageParser {
  async parse(page){
    this.page = page;
    await this.findImages();
  }

  async findImages() {
    this.imageUrls = await this.page.evaluate(() => {
      return [].map.call(document.querySelectorAll('img'), (el) => el.src);
    });
  }
}

module.exports = PageParser;
