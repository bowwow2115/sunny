const { defineConfig } = require('@vue/cli-service')
const houseDir =
  '/Users/parksh/projects/intellij/sunny/src/main/resources/static'

module.exports = defineConfig({
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  publicPath: process.env.NODE_ENV === 'production' ? '/sunny/app/' : '/',
  outputDir: houseDir,
  // publicPath: '/',
  transpileDependencies: ['vuetify'],
  runtimeCompiler: true,
  configureWebpack: {},
  devServer: {
    port: 8080,
    proxy: {
      '/sunny': {
        target: 'http://43.201.84.78:8084',
        // target: 'http://localhost:8084',
        changeOrigin: true,
        pathRewrite: {
          '^/sunny': '/sunny',
        },
      },
    },
  },
  lintOnSave: false,

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/variables.scss"`,
        sassOptions: {
          indentedSyntax: true, // .sass 파일에서 인덴트 문법을 사용하도록 설정합니다.
        },
      },
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`,
      },
    },
  },
})
