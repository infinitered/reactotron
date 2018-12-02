import babel from "rollup-plugin-babel"
import filesize from "rollup-plugin-filesize"

export default {
  input: "src/index.js",
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: ["es2015-rollup", "stage-1"],
    }),
    filesize(),
  ],
  output: {
    format: "cjs",
    file: "dist/index.js",
  },
}
