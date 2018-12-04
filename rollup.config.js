import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import ramda from 'rollup-plugin-ramda'

export default {
  input: 'compiled/reactotron-core-server.js',
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
    file: 'dist/reactotron-core-server.js',
    format: 'cjs',
    exports: 'named',
  },
  external: [
    'ramda/src/merge',
    'ramda/src/find',
    'ramda/src/propEq',
    'ramda/src/without',
    'ramda/src/contains',
    'ramda/src/forEach',
    'ramda/src/pluck',
    'ramda/src/reject',
    'ramda/src/allPass',
    'ramda/src/complement',
    'ramda/src/isNil',
    'ramda/src/is',
    'mitt',
    'ramdasauce',
    'ws',
  ],
}
