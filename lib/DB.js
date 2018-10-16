const dblite = require('dblite')

class DB {
  static setup() {
    this.db = dblite('db.sqlite')
    this.db.query(`
      CREATE TABLE IF NOT EXISTS pages(
        id INTEGER PRIMARY KEY,
        url TEXT,
        name TEXT,
        next_selector TEXT,
        name_selector TEXT,
        completed INTEGER DEFAULT 0,
        created_at TEXT
      )
    `)
    this.db.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS pages_url_index
      ON pages(url)
    `)
  }

  static existPage(page) {
    return new Promise((resolve, reject) => {
      this.db.query("SELECT 1 FROM pages WHERE url = :url", page, (err, rows) => {
        (err) ? reject(err) : resolve(rows > 0)
      })
    })
  }

  static insertPage(page) {
    const attrs = { ...page, created_at: (new Date()).toString() }
    const sql = `
      INSERT INTO pages(url, name, next_selector, name_selector, created_at)
      VALUES (:url, :name, :next_selector, :name_selector, :created_at)
    `
    return new Promise((resolve, reject) => {
      this.db.query(sql, attrs, (err, rows) => {
        (err) ? reject(err) : resolve(rows)
      })
    })
  }

  static updatePage(page) {
    const sql = `
      UPDATE pages SET
        url = :url,
        name = :name,
        next_selector = :next_selector,
        name_selector = :name_selector,
        completed = :completed
      WHERE id = :id
    `
    return new Promise((resolve, reject) => {
      this.db.query(sql, page, (err, rows) => {
        (err) ? reject(err) : resolve(rows)
      })
    })
  }

  static selectPages() {
    const sql = `SELECT * from pages`
    const attrTypes = {
      id: Number,
      url: String,
      name: String,
      next_selector: String,
      name_selector: String,
      completed: Number,
      created_at: Date
    }

    return new Promise((resolve, reject) => {
      return this.db.query(sql, attrTypes, (err, rows) => {
        (err) ? reject(err) : resolve(rows)
      })
    })
  }

  static close() {
    this.db.close()
  }
}

module.exports = DB
