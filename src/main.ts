/*
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-21 19:17:12
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

// 无限滚动
app.directive("scroll", {
  mounted(el, binding) {
    let scrollEle: any;
    let arg = binding.arg;
    let document = el.ownerDocument;
    if (arg) {
      let firstStr = arg[0];
      let classReg = /^\./;
      let idReg = /^#/;
      let text = arg.slice(1);
      if (classReg.test(firstStr)) {
        scrollEle = document.getElementsByClassName(text)[0];
      } else if (idReg.test(firstStr)) {
        scrollEle = document.getElementById(text);
      } else {
        scrollEle = document.getElementsByTagName(arg)[0]
      }
    } else {
      scrollEle = document.body;
    }
    scrollEle.addEventListener("scroll", () => {
      let parentEle = el.parentElement;
      let otherHeight = 0;
      // 递归获得父节点 offsetTop
      if (parentEle && parentEle.offsetTop) {
        while (parentEle !== scrollEle) {
          let top = parentEle.offsetTop;
          if (top) {
            otherHeight += top;
          }
          parentEle = parentEle.parentElement;
        }
      }
      let height = el.clientHeight + el.offsetTop + otherHeight;
      let scrollTop = scrollEle.scrollTop;

      if (height - scrollTop === scrollEle.clientHeight) {
        binding.value();
      }
    })
  }
})

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
