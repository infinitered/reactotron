import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

export default {
  input: "src/reactotron-core-server.ts",
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
    resolve({ extensions: [".ts", ".tsx"] }),
    babel({ extensions: [".ts", ".tsx"], runtimeHelpers: true }),
    process.env.NODE_ENV === "production"
      ? minify({
          comments: false,
        })
      : null,
    filesize(),
  ],
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
