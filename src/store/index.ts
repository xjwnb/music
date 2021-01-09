import { createStore } from 'vuex';
// mutation 函数名
import { LOGIN_HANDLE } from "./mutation-types";
// state 属性名
import { IS_LOGIN, ASIDE_NAV } from "./state-types";
// const 
import { asideNavInfo } from "@/const/public/index";


export default createStore({
  state: {
    // 登录状态
    [IS_LOGIN]: false,
    [ASIDE_NAV]: asideNavInfo
  },
  mutations: {
    // 登录
    [LOGIN_HANDLE](state) {
      state[IS_LOGIN] = true;
    }
  },
  actions: {
  },
  modules: {
  }
})
