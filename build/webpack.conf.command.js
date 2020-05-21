const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.conf.base')
const shellConfig = require('./webpack.conf.shell')
const process = require('process')
const isDev = process.env.mode === 'development'

module.exports = merge(baseConfig, shellConfig, {
  entry: {
    command: isDev ? path.join(__dirname, '../command/demo.js') : path.join(__dirname, '../command/index.js')
  },
  watch: isDev,
  mode: process.env.mode
})
