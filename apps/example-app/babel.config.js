/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = []

/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true)
  return {
    assumptions: {
      setPublicClassFields: true,
      privateFieldsAsSymbols: true,
    },
    presets: ["babel-preset-expo"],
    env: {
      production: {},
    },
    plugins,
  }
}
