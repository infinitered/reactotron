import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import sourceMaps from "rollup-plugin-sourcemaps"
import camelCase from "lodash.camelcase"
import filesize from "rollup-plugin-filesize"

// @ts-ignore
const pkg = require("./package.json")

const LIBRARY_NAME = "reactotron-mst"
const GLOBALS = ["ramda", "mobx-state-tree", "mobx"]

export default {
  input: `build/es/${LIBRARY_NAME}.js`,
  external: GLOBALS,
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
  watch: {
    include: "build/es/**",
  },
  plugins: [commonjs(), resolve(), sourceMaps(), filesize()],
}
