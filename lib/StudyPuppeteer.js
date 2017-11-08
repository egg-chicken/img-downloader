const Puppeteer = require('puppeteer');

class StudyPuppeteer {
  static run(url) {
    (async () => {
      const browser = await Puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await page.screenshot({path: 'out/example.png'});

      await browser.close();
    })();
  }
}

module.exports = StudyPuppeteer;
