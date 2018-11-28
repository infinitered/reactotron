import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import replace from "rollup-plugin-replace"

const coreClientVersion = require('./package.json').version

export default {
  input: 'compiled/reactotron-core-client.js',
  plugins: [
    commonjs({
      include: 'node_modules/**',
      ignoreGlobals: false,
    }),
    replace({
      REACTOTRON_CORE_CLIENT_VERSION: coreClientVersion,
    }),
    sourcemaps(),
    uglify(),
    filesize(),
  ],
  output: {
    file: 'dist/reactotron-core-client.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  }
}
