const StudyPuppeteer = require('./lib/StudyPuppeteer')
const DB = require('./lib/DB')
const Debug = require('./lib/Debug')
const config = require('./config')

class Main {
  constructor() {
    this.sp = new StudyPuppeteer()
  }

  static run() {
    (new Main()).main()
  }

  async insertPages() {
    const defaults = config.defaults
    for(let page of config.pages) {
      if(await DB.existPage(page)) {
        Debug.log(`${page.url} is already exists`)
      } else {
        Debug.log(`${page.url} inserted`)
        await DB.insertPage({...defaults, ...page})
      }
    }
  }

  async downloadPages() {
    const pages = await DB.selectPages()
    for(let page of pages) {
      if(page.completed === 0) {
        await this.sp.setup(page)
        await DB.updatePage({...page, name: this.sp.getName()})
        await this.sp.run()
        await DB.updatePage({...page, completed: 1})
      }
    }
  }

  async main() {
    try {
      DB.setup()
      await this.sp.open()
      await this.insertPages()
      console.table(await DB.selectPages())

      await this.downloadPages()
      await this.sp.close()
      console.table(await DB.selectPages())
    } catch(e) {
      console.log(`エラーが発生しました ${e}`)
    } finally {
      DB.close()
    }
  }
}

Main.run()
