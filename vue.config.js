const { defineConfig } = require('@vue/cli-service')
const registerRouter = require('./backend/router')


module.exports = defineConfig({
  transpileDependencies: true,
  css:{
    loaderOptions:{
      sass:{
        // 全局引入变量和mixin
        additionalData: `
        @import "@/assets/sass/variable.scss";
        @import "@/assets/sass/mixin.scss";
        ` 
      }
    }
  },
  // 配置跨域代理
  devServer:{
    onBeforeSetupMiddleware(app){
      registerRouter(app.app)
    }
  }
})
