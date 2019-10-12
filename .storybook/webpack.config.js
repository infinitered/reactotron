module.exports = ({ config }) => {
  config.resolve.extensions.push(".ts", ".tsx")

  config.module.rules.find(r => r.use.find(u => u.loader === "babel-loader")).test = /\.(mjs|jsx?|tsx?)$/

  return config
}
