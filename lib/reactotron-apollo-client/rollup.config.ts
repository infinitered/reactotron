import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

const pkg = require("./package.json")

const LIBRARY_NAME = "reactotron-apollo-client"
const GLOBALS = ["@apollo/client", "graphql"]

export default {
  input: "src/reactotron-apollo-client.ts",
  output: [
    {
      file: pkg.main,
      name: LIBRARY_NAME,
      format: "umd",
      sourcemap: true,
      globals: GLOBALS,
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true,
      globals: GLOBALS,
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
  external: ["@apollo/client", "reactotron-core-client", "graphql"],
}
