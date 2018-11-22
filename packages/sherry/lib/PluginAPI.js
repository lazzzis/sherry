module.exports =class PluginAPI {
  constructor(sherry) {
    this.sherry = sherry
  }

  registerCommand(fn) {
    fn && fn(this.sherry.cli)
  }
}
