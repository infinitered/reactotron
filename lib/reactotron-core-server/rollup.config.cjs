import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"
const pkg = require("./package.json")

export default {
  input: "src/reactotron-core-server.ts",
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
  external: [
    "ramda/src/merge",
    "ramda/src/find",
    "ramda/src/propEq",
    "ramda/src/without",
    "ramda/src/contains",
    "ramda/src/forEach",
    "ramda/src/pluck",
    "ramda/src/reject",
    "ramda/src/allPass",
    "ramda/src/complement",
    "ramda/src/isNil",
    "ramda/src/is",
    "mitt",
    "ramdasauce",
    "ws",
    "fs",
    "https",
  ],
}
