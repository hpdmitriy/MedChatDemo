const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './App/src/index.js'],
  devtool: 'source-map',
  output: {
    path: '/',
    filename: 'bundle.js'
  },

  devServer: {
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 4000,
    contentBase: path.join(__dirname + '/../public/'),
    proxy: {
      "*": "http://localhost:4500"
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel?' + JSON.stringify({
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-0']
        })],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      VERSION: JSON.stringify("5fa3b9"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object")
    }),
  ],

  resolve: {
    root: path.resolve('./src')
  }
};
