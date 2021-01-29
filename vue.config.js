/*
 * @Author: your name
 * @Date: 2021-01-08 17:09:01
 * @LastEditTime: 2021-01-29 23:54:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\vue.config.js
 */
module.exports = {
  publicPath: "/music/",
  // 取消 eslint
  lintOnSave: false,

  // 配置跨域
  configureWebpack: {
    devServer: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3333",
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            "^/api": ""
          }
        }
      }
    }
  }
};
