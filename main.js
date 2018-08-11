const StudyPuppeteer = require('./lib/StudyPuppeteer');
const config = require('./config');

config.pages.forEach((page) => {
  StudyPuppeteer.run(page)
})
