import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser"
import typescript from "@rollup/plugin-typescript"

const pkg = require("./package.json")

export default {
  input: "src/reactotron-template.ts",
  output: [
    {
      file: pkg.main,
      format: "commonjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ],
  plugins: [typescript(), process.env.NODE_ENV === "production" ? terser() : null, filesize()],
  // put any external react-native- deps here
  external: ["reactotron-core-client"],
}
