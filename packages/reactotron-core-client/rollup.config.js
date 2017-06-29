import typescript from 'rollup-plugin-typescript2'

export default {
  entry: 'src/index.ts',
  format: 'cjs',
  plugins: [
    typescript()
  ],
  dest: 'dist/index.js',
  external: [
    'ramda',
    'ramdasauce'
  ]
}
