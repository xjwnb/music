/*
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-19 23:29:37
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


// 判断登录状态
/* import { getLoginStatus } from "@/api/login";
getLoginStatus().then(res => {
  let data = (res as any).data.data;
  // console.log("getLoginStatus", data.code);
  if (data.code === 200) {
    // console.log("getLoginStatus", data);
    if (!data.account && !data.profile) {
      store.commit(LOGOUT_HANDLE);
      // console.log(store.state.IS_LOGIN)
      // router.push("/login");
    } else {
      store.commit(LOGIN_HANDLE);
      store.commit(USER_INFO_SET, { account: data });
      // console.log(store.state.IS_LOGIN)
      // router.push("/");
    }
  }
}) */

// element-plus 引入配置文件
import { getEle } from "./plugins/element/";
// mutation
import { LOGOUT_HANDLE, LOGIN_HANDLE, USER_INFO_SET } from "@/store/mutation-types";
getEle(app);



app.use(store).use(router).mount('#app')
