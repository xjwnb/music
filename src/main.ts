/*
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-11 21:24:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\main.ts
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// iconfont
import "@/assets/iconfont/iconfont.css";
// mitt 事件总线
import mitt from "mitt";

const app = createApp(App)

// 设置事件总线
app.config.globalProperties.$bus = new (mitt as any)();


// element-plus 引入配置文件
import { getEle } from "./plugins/element/";
getEle(app);


app.use(store).use(router).mount('#app')
