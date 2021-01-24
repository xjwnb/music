<!--
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-25 00:51:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\Home.vue
-->

<template>
  <div class="home">
    Home
    <div class="home-name">{{ nameMsg }}</div>
    <div>{{ data[0].name }} - {{ data[0].age }}</div>
  </div>

</template>

<script lang="ts">
import { defineComponent, reactive, ref, getCurrentInstance } from "vue";
// 请求
import {
  getRecommendBanner,
  getPersonalizedSong,
  getPersonalizedNewSong,
} from "@/api/recommend/index";
// 组件
import {
  CarouselCom,
  ClassifyShowCom,
  SongSheetCom,
  LatestMusicCom,
} from "@/components/index";
// audioHooks
import {
  useAddAudioListHooks,
  useChangeAudioIdHooks,
} from "@/hooks/audioHooks";
// store
import store from "@/store";
// mutations
import {
  AUDIO_ID_CHANGE,
  AUDIO_INFO_CHANGE,
  AUDIO_LIST_ADD,
} from "@/store/mutation-types";
// audio 接口
import { AudioInfoInterface } from "@/interface/public/audio";

export default defineComponent({
  name: "Home",
  components: {
    CarouselCom,
    ClassifyShowCom,
    SongSheetCom,
    LatestMusicCom,
  },
  setup() {
    const nameMsg = ref("我是小卡车");
    const data: any = ref([]);

    data.value = [{
      name: "小卡车",
      age: 21
    }]
    return {
      nameMsg,
      data,
    }
  }
});
</script>
