import replace from "@rollup/plugin-replace"
import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
const pkg = require("./package.json")

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/reactotron-core-client.ts",
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
