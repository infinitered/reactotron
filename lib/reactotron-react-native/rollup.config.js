import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

function getPlugins() {
  return [
    resolve({ extensions: [".ts", ".tsx"] }),
    babel({ extensions: [".ts", ".tsx"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ]
}

const EXTERNALS = [
  "reactotron-core-client",
  "react-native-flipper",
  "react",
  "react-native",
  "react-native/Libraries/Network/XHRInterceptor",
  "rn-host-detect",
  "query-string",
]

export default [
  {
    input: "src/reactotron-react-native.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
    },
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
