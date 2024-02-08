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
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [typescript(), process.env.NODE_ENV === "production" ? terser() : null, filesize()],
  external: ["redux", "reactotron-core-client"],
}
