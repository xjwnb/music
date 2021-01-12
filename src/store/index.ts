/*
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-12 16:03:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\store\index.ts
 */
import { createStore } from 'vuex';
// mutation 函数名
import { LOGIN_HANDLE, AUDIO_ID_CHANGE, AUDIO_LIST_ADD, USER_INFO_SET } from "./mutation-types";
// state 属性名
import { IS_LOGIN, ASIDE_NAV, AUDIO_ID, AUDIO_LIST, USER_INFO } from "./state-types";
// getter 
import { GET_AUDIO_ID } from "./getter-types";
// const 
import { asideNavInfo } from "@/const/public/index";

// useid 1559273326

export default createStore({
  state: {
    
    [IS_LOGIN]: false as boolean,             // 是否登录
    [USER_INFO]: {},                 // 用户信息
    [ASIDE_NAV]: asideNavInfo,     // aside 导航信息
    [AUDIO_ID]: "" as string,                // audio id
    [AUDIO_LIST]: [] as any[],              // audio 播放列表
  },
  getters: {
    [GET_AUDIO_ID](state) {
      return state[AUDIO_ID];
    }
  },
  mutations: {
    // 登录
    [LOGIN_HANDLE](state) {
      state[IS_LOGIN] = true;
    },
    // 设置用户信息
    [USER_INFO_SET](state, payload) {
      state[USER_INFO] = payload.account;
    },
    // 修改设置 audio id
    [AUDIO_ID_CHANGE](state, payload) {
      state[AUDIO_ID] = payload.id;
    },
    // 增加播放列表歌曲
    [AUDIO_LIST_ADD](state, payload: any) {
      let audioData: any | any[] = payload.audioData;
      if (audioData instanceof Array) {
        audioData.forEach(audioItem => {
          let hasAudioData = state[AUDIO_LIST].some(audio => audio.id === audioItem.id);
          hasAudioData ? null : state[AUDIO_LIST].unshift(audioItem);
        })
      } else {
        state[AUDIO_LIST].unshift(payload.audioData);
      }
    },

    // 格式化
    formatState(state) {
      state[AUDIO_ID] = "";
      state[AUDIO_LIST] = [];
    }
  },
  actions: {
  },
  modules: {
  }
})
