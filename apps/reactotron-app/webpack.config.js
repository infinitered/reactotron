// webpack 4 has an issue on Node 17+ where openssl throws
// an error when trying to call crypto.createHash('md5').
// In order to fix this, we are providing a custom hash function.
// See: https://stackoverflow.com/a/69476335

// This config along with patch-package removes all the references to md5 in our node_modules webpack.
// This solution is brittle because it's dependent on the webpack version, but will be fixed after upgrading to webpack 5.

// If this breaks again, you search webpack in node_modules for `createHash\(('|")md4('|")\)`,
// replace it with `createHash("sha256")`, then run patch-package again.

const path = require("path")

module.exports = function (config) {
  // The MCP SDK and its dependencies (zod, @hono/node-server, etc.) use modern
  // JS syntax that webpack 4's acorn parser can't handle. Transpile them all
  // through @babel/preset-env targeting the Electron version we ship.
  const mcpBabelRule = {
    test: /\.js$/,
    include: [
      /node_modules[\\/]@modelcontextprotocol/,
      /node_modules[\\/]zod/,
      /node_modules[\\/]zod-to-json-schema/,
      /node_modules[\\/]@hono/,
    ],
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          ["@babel/preset-env", { targets: { electron: "27" } }],
        ],
      },
    },
  }

  return {
    ...config,
    output: {
      ...config.output,
      hashFunction: "sha256",
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        // @modelcontextprotocol/sdk uses package.json "exports" for subpath resolution
        // which webpack 4 doesn't support. Map subpaths to actual file locations.
        "@modelcontextprotocol/sdk/server/index": path.resolve(
          __dirname, "../../node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js"
        ),
        "@modelcontextprotocol/sdk/server/streamableHttp": path.resolve(
          __dirname, "../../node_modules/@modelcontextprotocol/sdk/dist/esm/server/streamableHttp.js"
        ),
        "@modelcontextprotocol/sdk/types": path.resolve(
          __dirname, "../../node_modules/@modelcontextprotocol/sdk/dist/esm/types.js"
        ),
      },
    },
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules || []),
        mcpBabelRule,
      ],
    },
  }
}
