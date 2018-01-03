import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import sourceMaps from "rollup-plugin-sourcemaps"
import camelCase from "lodash.camelcase"

const pkg = require("./package.json")

const libraryName = "reactotron-mst"

export default {
  input: `dist/es/${libraryName}.js`,
  output: [
    { file: pkg.main, name: camelCase(libraryName), format: "umd", sourcemap: true },
    { file: pkg.module, format: "es", sourcemap: true },
  ],
  external: ["ramda", "mobx-state-tree", "mobx"],
  watch: {
    include: "dist/es/**",
  },
  plugins: [commonjs(), resolve(), sourceMaps()],
}
