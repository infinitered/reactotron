import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: ['es2015-rollup', 'stage-1']
    })
  ],
  dest: 'dist/index.js',
  exports: 'named',
  external: [
    'ramda',
    'react-native',
    'reactotron-core-client'
  ]
}
