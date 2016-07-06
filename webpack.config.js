var webpack = require('webpack');
var path = require('path');

var isProduction = process.env.NODE_ENV === 'production';
var port = process.env.PORT || 3000;

var plugins = [
  new webpack.optimize.CommonsChunkPlugin('common.js'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (!isProduction) {
  plugins.push(new webpack.NoErrorsPlugin())
}

if (isProduction) {
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

var entry = {
  bundle: !isProduction ? [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/entry'
  ] : './src/entry'
};

module.exports = {
  devtool: !isProduction ? 'inline-source-map' : null,

  entry: entry,

  output: {
    path: path.join(__dirname, '/public/'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  plugins: plugins,

  module: {
    loaders: [{
      test: require.resolve('react'),
      loader: 'expose?React'
    }, {
      test: /\.jsx?$/,
      loaders: !isProduction ? ['react-hot', 'babel'] : ['babel'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }]
  }
};
