const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
  transpileDependencies: ["vuetify"],
  runtimeCompiler: true,
  // configureWebpack: (config) => {
  //   config.devtool = "#source-map";
  // },
  publicPath: process.env.NODE_ENV === "production" ? "/sunny/app" : "/",
  devServer: {
    port: 8080,
    proxy: {
        '/sunny': {
            // target: 'http://43.201.84.78:8084',
            target: 'http://localhost:8084',
            changeOrigin: true,
            pathRewrite: {
                '^/sunny': '/sunny'
            }
        }
    }
  },
  lintOnSave: false
});
