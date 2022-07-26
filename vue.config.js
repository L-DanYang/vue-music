const { defineConfig } = require('@vue/cli-service')
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
  }
})
