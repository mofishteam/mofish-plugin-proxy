module.exports = {
  devServer: {
    port: 8988,
    proxy: {
      '/api': {
        target: 'http://localhost:8900/',
        changeOrigin: true
      },
      '/plugin': {
        target: 'http://localhost:8900/',
        changeOrigin: true
      }
    }
  }
}
