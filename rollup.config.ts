import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"
import camelCase from "lodash.camelcase"

// @ts-ignore
const pkg = require("./package.json")

const LIBRARY_NAME = "reactotron-mst"
const GLOBALS = ["ramda", "mobx-state-tree", "mobx"]

export default {
  input: "src/reactotron-mst.ts",
  output: [
    {
      file: pkg.main,
      name: camelCase(LIBRARY_NAME),
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
  external: ["ramda", "mobx-state-tree", "mobx"],
}
