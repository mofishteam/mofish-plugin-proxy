const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.conf.base')
const shellConfig = require('./webpack.conf.shell')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const process = require('process')
const isDev = process.env.mode === 'development'
console.log(path.join(__dirname + '../dev-dist'))

const webpackConfig = merge(baseConfig, shellConfig, {
  entry: {
    core: path.join(__dirname, '../server/index.js')
  },
  output: {
    filename: '[name].js',
    path: isDev ? path.join(__dirname, '../dev-dist') : path.join(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      }
    ]
  }
})

module.exports = webpackConfig
