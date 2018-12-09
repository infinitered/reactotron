import webpack from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import baseConfig from "./webpack.config.base"

const config = {
  ...baseConfig,

  devtool: "source-map",

  entry: "./App/index",

  output: {
    ...baseConfig.output,

    publicPath: "../dist/",
  },

  module: {
    ...baseConfig.module,

    rules: [
      ...baseConfig.module.rules,

      {
        test: /\.global\.css$/,
        loader: "style-loader!css-loader",
      },

      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]"
        ]
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__: false,
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],

  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  target: "electron-renderer",
}

export default config
