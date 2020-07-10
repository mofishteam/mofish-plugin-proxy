const merge = require('webpack-merge')
const shellConfig = require('./webpack.conf.shell')
const process = require('process')
const isDev = process.env.mode === 'development'

const webpackConfig = merge(shellConfig, {
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      }
    ]
  },
  watch: isDev,
  mode: process.env.mode
})

module.exports = webpackConfig
