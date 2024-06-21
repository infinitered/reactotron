const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config")
const fs = require("fs")
const exclusionList = require("metro-config/src/defaults/exclusionList")
const path = require("path")

const rnwPath = fs.realpathSync(
  path.resolve(require.resolve("react-native-windows/package.json"), "..")
)

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: exclusionList([
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(`${path.resolve(__dirname, "windows").replace(/[/\\]/g, "/")}.*`),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ]),
    extraNodeModules: {
      // This is needed for navigation but not suppported on macOS and also useless on macOS so we'll just stub it out
      "react-native-safe-area-context": path.resolve(
        __dirname,
        "stubs/react-native-safe-area-context"
      ),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // This fixes the 'missing-asset-registry-path` error (see https://github.com/microsoft/react-native-windows/issues/11437)
    assetRegistryPath: "react-native/Libraries/Image/AssetRegistry",
  },
  watchFolders: [
    path.resolve(__dirname, "../../lib"),
    path.resolve(__dirname, "../../node_modules"),
  ],
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
