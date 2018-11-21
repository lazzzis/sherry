module.exports = class SherryError extends Error {
  constructor(msg) {
    super(msg)
    this.__sherry = true
  }
}
