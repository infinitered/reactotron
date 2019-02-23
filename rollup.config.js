import resolve from "rollup-plugin-node-resolve"
import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"
import minify from "rollup-plugin-babel-minify"

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  plugins: [
    resolve({ extensions: [".ts"] }),
    babel({ extensions: [".ts"], runtimeHelpers: true }),
    minify({
      comments: false,
    }),
    filesize(),
  ],
  external: ["redux"],
}
