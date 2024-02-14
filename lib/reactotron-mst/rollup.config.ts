import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

const pkg = require("./package.json")

export default {
  input: "src/reactotron-mst.ts",
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
    resolve({ extensions: [".ts"] }),
    babel({ extensions: [".ts"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ],
  external: ["ramda", "mobx-state-tree", "mobx", "reactotron-core-client"],
}
