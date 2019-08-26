module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 8988,
    proxy: {
      '/api': {
        target: 'http://localhost:8990/',
        changeOrigin: true
      },
      '/plugin': {
        target: 'http://localhost:8990/',
        changeOrigin: true
      }
    }
  }
}
