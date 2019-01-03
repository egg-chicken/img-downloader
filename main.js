const Browser = require('./lib/Browser')
const DB = require('./lib/DB')
const Debug = require('./lib/Debug')
const config = require('./config')

class Main {
  constructor() {
    this.browser = new Browser()
  }

  static run() {
    (new Main()).main()
  }

  async insertPages() {
    const defaults = config.defaults
    for(let page of config.pages) {
      if(page.url === "") {
      } else if(await DB.existPage(page)) {
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
        await this.browser.setup(page)
        await DB.updatePage({...page, name: this.browser.getName()})
        await this.browser.run()
        await DB.updatePage({...page, name: this.browser.getName(), completed: 1})
      }
    }
  }

  async main() {
    try {
      DB.setup()
      await this.browser.open()
      await this.insertPages()
      console.table(await DB.selectPages())

      await this.downloadPages()
      await this.browser.close()
      console.table(await DB.selectPages())
    } catch(e) {
      console.log(`エラーが発生しました ${e}`)
    } finally {
      DB.close()
    }
  }
}

Main.run()
