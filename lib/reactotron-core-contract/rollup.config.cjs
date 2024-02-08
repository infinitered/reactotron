import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import replace from "rollup-plugin-replace"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

const coreClientVersion = require("./package.json").version

export default {
  input: "src/reactotron-core-contract.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    resolve({ extensions: [".ts"] }),
    replace({
      REACTOTRON_CORE_CLIENT_VERSION: coreClientVersion,
    }),
    babel({ extensions: [".ts"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ],
}
