import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"

const pkg = require("./package.json")
const external = Object.keys(pkg.dependencies)

export default {
  input: "src/index.js",
  plugins: [
    babel({
      presets: ["es2015-rollup", "stage-1"],
    }),
    filesize(),
  ],
  external,
  output: {
    file: "dist/index.js",
    format: "cjs",
    exports: "named",
  },
}
