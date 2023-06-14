import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

// @ts-ignore
const pkg = require("./package.json")

const LIBRARY_NAME = "reactotron-react-native-mmkv"
const GLOBALS = ["react-native-mmkv"]

export default {
  input: "src/reactotron-react-native-mmkv.ts",
  output: [
    {
      file: pkg.main,
      name: LIBRARY_NAME,
      format: "umd",
      sourcemap: true,
      globals: GLOBALS,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      globals: GLOBALS,
    },
  ],
  plugins: [
    resolve({ extensions: [".ts"] }),
    babel({ extensions: [".ts"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ],
  external: ["react-native-mmkv", "reactotron-core-client"],
}
