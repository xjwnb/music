/*
 * @Author: your name
 * @Date: 2021-01-12 13:33:22
 * @LastEditTime: 2021-01-12 14:59:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\hooks\audioHooks\useChangeAudioId.ts
 */
import store from "@/store";
// mutations
import { AUDIO_ID_CHANGE } from "@/store/mutation-types";

// 修改 vuex 中的 audio id
export default function useChangeAudioId(id: number) {
  store.commit(AUDIO_ID_CHANGE, {
    id: (id as number).toString()
  });
}




