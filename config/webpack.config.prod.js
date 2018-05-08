const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: ['babel-polyfill', './App/src/index_prod.js'],

    output: {
        path: path.join(__dirname, '/../static/'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react', 'stage-0']
                })],
                exclude: /node_modules/,
            },
          {
            test:   /\.css$/,
            loader: 'style!css'
          }
        ]
    },

    plugins: [
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
        VERSION: JSON.stringify("5fa3b9"),
        BROWSER_SUPPORTS_HTML5: true,
      }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false,
            drop_console: true
          },
          mangle: {
            screw_ie8: true
          },
          output: {
            comments: false,
            screw_ie8: true
          }
        })
    ],

    resolve: {
        root: path.resolve('./src')
    }
};
