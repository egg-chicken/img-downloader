const Puppeteer = require('puppeteer');

class StudyPuppeteer {
  constructor(config) {
    this.config = config;
  }

  async open() {
    this.browser = await Puppeteer.launch();
    this.page = await this.browser.newPage();
  }

  async snap() {
    await this.page.goto(this.config.url);
    await this.page.screenshot({path: 'out/snap.png'});
  }

  async nextSnap() {
    await this.page.click(this.config.next);
    await this.page.waitForNavigation({waitUntil:"networkidle"});
    await this.page.screenshot({path: 'out/nextSnap.png'});
  }

  async close() {
    await this.browser.close();
  }

  static async run(config) {
    const s = new StudyPuppeteer(config);
    await s.open();
    await s.snap();
    await s.nextSnap();
    await s.close();
  }
}

module.exports = StudyPuppeteer;
