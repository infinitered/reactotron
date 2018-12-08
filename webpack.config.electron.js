import webpack from "webpack"
import baseConfig from "./webpack.config.base"

export default {
  ...baseConfig,

  devtool: "source-map",

  entry: "./main.development",

  output: {
    path: __dirname,
    filename: "./main.js",
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install()',
      raw: true,
      entryOnly: true,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],

  optimization: {
    minimize: true,
  },

  target: "electron-main",

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: [...baseConfig.externals, "font-awesome", "source-map-support"],
}
