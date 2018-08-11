const StudyPuppeteer = require('./lib/StudyPuppeteer');
const config = require('./config');


async function main() {
  for(let page of config.pages) {
    console.log(`Start ${page.name}`)
    await StudyPuppeteer.run(page)
  }
}

main()
