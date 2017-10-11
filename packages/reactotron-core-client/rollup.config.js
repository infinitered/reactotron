import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup', 'stage-1']
    })
  ],
  dest: 'dist/index.js',
  external: ['ramda', 'ramdasauce', 'json-stringify-safe']
}
