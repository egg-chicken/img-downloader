const StudyPuppeteer = require('./lib/StudyPuppeteer');
const DB = require('./lib/DB');
const config = require('./config')

class Main {
  static run() {
    (new Main()).main()
  }

  async insertPages() {
    for(let page of config.pages) {
      if(await DB.existPage(page)) {
        console.log(`${page.url} is already exists`)
      } else {
        console.log(`${page.url} inserted`)
        await DB.insertPage(page)
      }
    }
  }

  async downloadPages() {
    const pages = await DB.selectPages()
    for(let page of pages) {
      if(page.completed === 0) {
        console.log(`download ${page.url}`)
        await StudyPuppeteer.run(page)
        console.log(`completed`)
        await DB.updatePage({...page, completed: 1})
      }
    }
  }

  async main() {
    try {
      DB.setup()
      await this.insertPages()
      await this.downloadPages()
      console.table(await DB.selectPages())
    } catch(e) {
      console.log(`エラーが発生しました ${e}`)
    } finally {
      DB.close()
    }
  }
}

Main.run()
