import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'

const reactotronReactNativeVersion = require('./package.json').version

export default {
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: ['es2015-rollup', 'stage-1'],
      plugins: ['babel-plugin-transform-react-jsx']
    }),
    replace({
      REACTOTRON_REACT_NATIVE_VERSION: reactotronReactNativeVersion
    }),
    uglify(),
    filesize()
  ],
  dest: 'dist/index.js',
  exports: 'named',
  external: [
    'ramda',
    'react-native',
    'reactotron-core-client',
    'mitt',
    'react',
    'rn-host-detect',
    'react-native/Libraries/Network/XHRInterceptor',
    'prop-types'
  ]
}
