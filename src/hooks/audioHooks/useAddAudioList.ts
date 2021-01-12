/*
 * @Author: your name
 * @Date: 2021-01-12 14:23:31
 * @LastEditTime: 2021-01-12 14:25:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\hooks\audioHooks\useAddAudioList.ts
 */
import store from "@/store";
// mutations
import { AUDIO_LIST_ADD } from "@/store/mutation-types";

// 添加 audio 播放列表
export default function useAddAudioList(audioData: any) {
  store.commit(AUDIO_LIST_ADD, {
    audioData
  })
}