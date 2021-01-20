/*
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-19 19:11:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\store\index.ts
 */
import { createStore } from 'vuex';
// mutation 函数名
import { LOGIN_HANDLE, LOGOUT_HANDLE, AUDIO_ID_CHANGE, AUDIO_LIST_ADD, USER_INFO_SET, AUDIO_INFO_CHANGE } from "./mutation-types";
// state 属性名
import { IS_LOGIN, ASIDE_NAV, AUDIO_ID, AUDIO_LIST, USER_INFO, AUDIO_INFO } from "./state-types";
// getter 
import { GET_AUDIO_ID } from "./getter-types";
// const 
import { asideNavInfo } from "@/const/public/index";
// audio 接口
import { AudioInfoInterface } from "@/interface/public/audio";

// useid 1559273326

export default createStore({
  state: {

    [IS_LOGIN]: false as boolean,             // 是否登录
    [USER_INFO]: {},                 // 用户信息
    [ASIDE_NAV]: asideNavInfo,     // aside 导航信息
    [AUDIO_ID]: "" as string,                // audio id
    [AUDIO_INFO]: {} as AudioInfoInterface,                  // 当前播放歌曲信息
    [AUDIO_LIST]: [] as AudioInfoInterface[],              // audio 播放列表
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
    // 退出登录
    [LOGOUT_HANDLE](state) {
      state[IS_LOGIN] = false;
    },
    // 设置用户信息
    [USER_INFO_SET](state, payload) {
      state[USER_INFO] = payload.account;
    },
    // 修改设置 audio id
    [AUDIO_ID_CHANGE](state, payload) {
      state[AUDIO_ID] = payload.id;
    },
    // 设置当前播放歌曲信息
    [AUDIO_INFO_CHANGE](state, payload) {
      state[AUDIO_INFO] = payload.audioInfo;
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
        let hasSameAudio = state[AUDIO_LIST].some(audio => audio.id === audioData.id);
        hasSameAudio ? null : state[AUDIO_LIST].unshift(payload.audioData);
      }
    },

    // 格式化
    formatState(state) {
      state[AUDIO_ID] = "";
      state[AUDIO_INFO] = {
        id: "",
        songName: "",
        artistName: "",
        playTime: 0,
        picUrl: ""
      }
      state[AUDIO_LIST] = [];
    }
  },
  actions: {
  },
  modules: {
  }
})
