import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import external from "rollup-plugin-peer-deps-external"
import typescript from "@rollup/plugin-typescript"
const pkg = require("./package.json")

export default {
  input: "src/reactotron-core-ui.ts",
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
  plugins: [
    typescript(),
    external({ includeDependencies: true }),
    process.env.NODE_ENV === "production" ? terser() : null,
    filesize(),
  ],
}
