// webpack 4 has an issue on Node 17+ where openssl throws
// an error when trying to call crypto.createHash('md5').
// In order to fix this, we are providing a custom hash function.
// See: https://stackoverflow.com/a/69476335

// This config along with patch-package removes all the references to md5 in our node_modules webpack.
// This solution is brittle because it's dependent on the webpack version, but will be fixed after upgrading to webpack 5.

// If this breaks again, you search webpack in node_modules for `createHash\(('|")md4('|")\)`,
// replace it with `createHash("sha256")`, then run patch-package again.

module.exports = function (config) {
  return {
    ...config,
    output: {
      ...config.output,
      hashFunction: "sha256",
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "react-native$": "react-native-web",
      },
    },
  }
}
