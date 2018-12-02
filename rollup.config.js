import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import replace from "rollup-plugin-replace"

const pkg = require("./package.json")
const external = Object.keys(pkg.dependencies)

const reactotronReactJsVersion = pkg.version


export default {
  input: "src/index.js",
  plugins: [
    babel({
      presets: ["es2015-rollup", "stage-1"],
    }),
    replace({
      REACTOTRON_REACT_JS_VERSION: reactotronReactJsVersion,
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
