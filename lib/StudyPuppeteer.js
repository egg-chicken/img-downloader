const Puppeteer = require('puppeteer');

class StudyPuppeteer {
  static async run(config) {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(config.url);
    await page.screenshot({path: 'out/firstpage.png'});
    await page.click(config.next);
    await page.waitForNavigation({waitUntil:"networkidle"});
    await page.screenshot({path: 'out/nextpage.png'});

    await browser.close();
  }
}

module.exports = StudyPuppeteer;
