import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
  input: 'compiled/reactotron-core-client.js',
  sourcemap: true,
  plugins: [
    commonjs({
      include: 'node_modules/**',
      ignoreGlobals: false,
    }),
    sourcemaps(),
    uglify(),
    filesize(),
  ],
  output: {
    file: 'dist/reactotron-core-client.js',
    format: 'cjs',
    exports: 'named',
  }
}
