import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import sucrase from "@rollup/plugin-sucrase"
import resolve from "@rollup/plugin-node-resolve"
const pkg = require("./package.json")

function getPlugins() {
  return [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    sucrase({
      exclude: /^(.+\/)?node_modules\/.+$/,
      transforms: ["typescript", "imports"],
    }),
    process.env.NODE_ENV === "production" ? terser() : null,
    filesize(),
  ]
}

const EXTERNALS = [
  "reactotron-core-client",
  "react-native-flipper",
  "react",
  "react-native",
  "react-native/Libraries/Network/XHRInterceptor",
  "query-string",
]

export default [
  {
    input: "src/reactotron-react-native.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "esm",
      },
    ],
    plugins: getPlugins(),
    external: EXTERNALS,
  },
  {
    input: "src/flipper-connection-manager.ts",
    output: {
      file: "dist/flipper.js",
      format: "cjs",
    },
    plugins: getPlugins(),
    external: EXTERNALS,
  },
]
