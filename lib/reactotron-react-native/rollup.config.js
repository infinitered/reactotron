import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import terser from '@rollup/plugin-terser'

function getPlugins() {
  return [
    nodeResolve({ extensions: [".ts", ".tsx"] }),
    commonjs(),
    babel({ babelHelpers: 'runtime', extensions: [".ts", ".tsx"], plugins: ["@babel/plugin-transform-runtime"] }),
    process.env.NODE_ENV === "production"
      ? terser()
      : null,
    filesize(),
  ]
}

const EXTERNALS = [
  /@babel\/runtime/, // https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
  "reactotron-core-client",
  "react-native-flipper",
  "react",
  "react-native",
  "react-native/Libraries/Network/XHRInterceptor",
]

export default [
  {
    input: "src/reactotron-react-native.ts",
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
    plugins: getPlugins(),
    external: EXTERNALS,
    strictDeprecations: true,
  },
  {
    input: "src/flipper-connection-manager.ts",
    output: {
      file: "dist/flipper.js",
      format: "cjs",
    },
    plugins: getPlugins(),
    external: EXTERNALS,
    strictDeprecations: true,
  },
]