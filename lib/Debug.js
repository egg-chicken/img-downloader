class Debug {
  static log (text) {
    this.flag && console.debug(text);
  }
}

Debug.flag = process.env.NODE_DEBUG;
module.exports = Debug
