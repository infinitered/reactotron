import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.ts',
  format: 'cjs',
  plugins: [
    typescript(),
    commonjs({
      include: 'node_modules/**',
      ignoreGlobals: false
    })
  ],
  dest: 'dist/index.js',
  exports: 'named',
  external: ['ramda', 'mobx', 'ramdasauce', 'ws']
}
