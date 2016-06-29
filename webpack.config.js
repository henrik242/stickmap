var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'inline-source-map',

  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/entry'
  ],

  output: {
    path: path.join(__dirname, '/public/'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [{
      test: require.resolve('react'),
      loader: 'expose?React'
    }, {
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }]
  }
};
