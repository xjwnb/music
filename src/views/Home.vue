<!--
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-30 00:19:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\Home.vue
-->

<template>
  <div class="home">
    <div class="home-name">昵称：{{ data[0].name }}</div>
    <div class="home-github">Github：<a href="https://github.com/xjwnb" target="_blank">Github链接</a></div>
    <div class="home-technology-blog">个人技术博客：<a href="http://120.27.238.251/blog/" target="_blank">博客链接</a></div>
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

    data.value = [
      {
        name: "小卡车",
      },
    ];
    return {
      nameMsg,
      data,
    };
  },
});
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  .home-name {
    font-size: 45px;
    font-weight: 700;
    background-image: linear-gradient(
      to bottom right,
      rgb(149, 66, 226),
      rgb(74, 243, 192)
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .home-github {
    font-size: 30px;
    font-weight: 700;
    background-image: linear-gradient(
      to bottom right,
      rgb(132, 201, 138),
      rgb(39, 56, 129)
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .home-technology-blog {
    font-size: 30px;
    font-weight: 700;
    background-image: linear-gradient(
      to bottom right,
      rgb(172, 85, 150),
      rgb(97, 84, 52)
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
