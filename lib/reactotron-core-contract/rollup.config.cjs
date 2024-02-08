import replace from "@rollup/plugin-replace"
import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
const pkg = require("./package.json")

export default {
  input: "src/reactotron-core-contract.ts",
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
    replace({
      REACTOTRON_CORE_CLIENT_VERSION: pkg.version,
    }),
    process.env.NODE_ENV === "production" ? terser() : null,
    filesize(),
  ],
}
