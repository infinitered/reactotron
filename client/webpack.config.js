const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devServer: {
    stats: {
      assets: false,
      children: false,
      colors: true,
      chunks: false,
      modules: false,
      timings: true
    }
  },
  devtool: 'cheap-module-source-map',
  entry: ['babel-polyfill', './index.web.js'],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: 'react-native'
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: 'dist'
  },
  plugins: [
    // creates the static HTML page
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'web-html.ejs'),
      title: 'title'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web'
    }
  }
};
