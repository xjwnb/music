/*
 * @Author: your name
 * @Date: 2021-01-08 17:09:01
 * @LastEditTime: 2021-01-30 11:05:50
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
        "/musicApi": {
          target: "http://127.0.0.1:3333",
          ws: true,
          changeOrigin: true,
          pathRewrite: {
            "^/musicApi": ""
          }
        }
      }
    }
  }
};
