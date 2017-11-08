const Puppeteer = require('puppeteer');

class StudyPuppeteer {
  static run(config) {
    (async () => {
      const browser = await Puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(config.url);
      await page.screenshot({path: 'out/example.png'});

      await browser.close();
    })();
  }
}

module.exports = StudyPuppeteer;
