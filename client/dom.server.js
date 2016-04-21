var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./dom.webpack.config');

const PORT = 5001

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(PORT, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log(`Listening at http://localhost:${PORT}/`);
});
