import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import ramda from 'rollup-plugin-ramda'

export default {
  input: 'compiled/reactotron-core-client.js',
  sourcemap: true,
  plugins: [
    commonjs({
      include: 'node_modules/**',
      ignoreGlobals: false,
    }),
    ramda(),
    sourcemaps(),
    uglify(),
    filesize(),
  ],
  output: {
    file: 'dist/reactotron-core-client.js',
    format: 'cjs',
    exports: 'named',
  },
  external: [
    'ramda/src/allPass',
    'ramda/src/complement',
    'ramda/src/contains',
    'ramda/src/forEach',
    'ramda/src/has',
    'ramda/src/head',
    'ramda/src/is',
    'ramda/src/isEmpty',
    'ramda/src/isNil',
    'ramda/src/keys',
    'ramda/src/last',
    'ramda/src/length',
    'ramda/src/merge',
    'ramda/src/tail',
  ],
}
