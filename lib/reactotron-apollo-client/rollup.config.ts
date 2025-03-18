import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import { terser } from "rollup-plugin-terser" // use terser for minification

const pkg = require("./package.json")

export default {
  input: "src/index.ts",
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
  plugins: [
    resolve({ extensions: [".ts"] }),
    babel({ extensions: [".ts"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production" ? terser() : null,
    filesize(),
  ],
  external: ["ramda", "@apollo/client", "reactotron-core-client", "graphql"],
}
