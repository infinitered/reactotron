import replace from "@rollup/plugin-replace"
import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
const pkg = require("./package.json")

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [
    typescript(),
    replace({
      REACTOTRON_REACT_JS_VERSION: pkg.version,
    }),
    process.env.NODE_ENV === "production" ? terser() : null,
    filesize(),
  ],
  external: ["stacktrace-js", "reactotron-core-client"],
}
