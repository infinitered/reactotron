import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'

const pkg = require('./package.json')
const external = Object.keys(pkg.dependencies)

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: babelrc(),
      presets: ['es2015-rollup', 'stage-1']
    })
  ],
  external,
  dest: 'dist/index.js',
  exports: 'named'
}
