<!--
 * @Author: your name
 * @Date: 2021-01-09 22:49:56
 * @LastEditTime: 2021-01-30 12:16:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\Recommend\index.vue
-->
<template>
  <div class="recommend-page">
    <!-- banner -->
    <div class="recommend-banner">
      <carousel-com :carouselData="bannersData" />
    </div>
    <!-- 推荐歌单 -->
    <div class="recommend-song-sheet">
      <classify-show-com>
        <template v-slot:title>
          <div class="recommend-song-sheet-title" @click="clickTitleHandle">
            推荐歌单
          </div>
        </template>
        <template v-slot:content>
          <div class="recommend-song-content">
            <song-sheet-com
              v-for="songSheetData in personalizedSongData"
              :songSheetData="songSheetData"
              @click="songSheetClickHandle(songSheetData)"
            ></song-sheet-com>
          </div>
        </template>
      </classify-show-com>
    </div>
    <!-- 最新音乐 -->
    <div class="recommend-latest-music">
      <classify-show-com>
        <template v-slot:title> 最新音乐 </template>
        <template v-slot:content>
          <div class="recommend-latest-music-content">
            <latest-music-com
              v-for="latestMusic in latestMusicData"
              :latestMusicData="latestMusic"
              @click="latestMusicClickHandle(latestMusic)"
            ></latest-music-com>
          </div>
        </template>
      </classify-show-com>
    </div>
  </div>
</template>


<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  getCurrentInstance,
  onMounted,
} from "vue";
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
  name: "Recommend",
  components: {
    CarouselCom,
    ClassifyShowCom,
    SongSheetCom,
    LatestMusicCom,
  },
/*   data() {
    return {
      bannersData: [], // banner 数据
      personalizedSongData: [], // 推荐歌单数据
      latestMusicData: [], // 最新音乐数据
    };
  }, */
  setup($props) {
    // banner 数据
    const bannersData = ref([]);
    // 推荐歌单数据
    const personalizedSongData = ref([]);
    // 最新音乐数据
    const latestMusicData = ref([]);
    const instance: any = getCurrentInstance();
    const root = instance.proxy;

    onMounted(async () => {
      // banner 数据请求
      try {
        const res: any = await getRecommendBanner();
        const data: any = res.data;
        if (data.code === 200 && data.banners) {
          bannersData.value = data.banners;
        } else {
          console.log("getRecommendBanner", "出错了");
        }
      } catch (e) {
        console.log(e);
      }

      // 获取推荐歌单
      getPersonalizedSong()
        .then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            personalizedSongData.value = data.result;
          } else {
            console.log("getPersonalizedSong 推荐歌单", data.code);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // 获取最新音乐
      getPersonalizedNewSong()
        .then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            latestMusicData.value = data.result;
          }
        })
        .catch((err) => {
          console.log("最新音乐", err);
        });
    });

    // methods
    // 歌单点击事件
    const songSheetClickHandle = (audioData: any) => {
      root.$router.push(`/songlists/${audioData.id}`);
    };

    // 最新音乐点击
    const latestMusicClickHandle = (latestMusic: any) => {
      console.log(latestMusic);
      let { id, name, song, picUrl } = latestMusic;
      let audioInfo: AudioInfoInterface = {
        id: id,
        songName: name,
        artistName: song.artists[0].name,
        playTime: song.bMusic.playTime,
        picUrl: picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id: id });
      store.commit(AUDIO_INFO_CHANGE, {
        audioInfo: audioInfo,
      });
      store.commit(AUDIO_LIST_ADD, {
        audioData: audioInfo,
      });
      // 触发播放音频
      root.$bus.emit("audioPlay");
    };

    // 点击推荐歌单title事件
    const clickTitleHandle = () => {
      root.$router.push("/discover/songSheet");
    };

    return {
      bannersData,
      personalizedSongData,
      latestMusicData,
      // methods
      songSheetClickHandle,
      latestMusicClickHandle,
      clickTitleHandle,
    };
  },
  /* mounted() {
    // 获取 banner
    getRecommendBanner()
      .then((res) => {
        let data = (<any>res).data;
        if (data.code === 200) {
          this.bannersData = data.banners;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 获取推荐歌单
    getPersonalizedSong()
      .then((res) => {
        console.log((res as any).data);
        let data = (res as any).data;
        if (data.code === 200) {
          this.personalizedSongData = data.result;
        } else {
          console.log("getPersonalizedSong 推荐歌单", data.code);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // 获取最新音乐
    getPersonalizedNewSong()
      .then((res) => {
        console.log("最新音乐", res);
        let data = (res as any).data;
        if (data.code === 200) {
          this.latestMusicData = data.result;
        }
      })
      .catch((err) => {
        console.log("最新音乐", err);
      });
  }, */
 /*  methods: {
    // 歌单点击事件
    songSheetClickHandle(audioData: any) {
      this.$router.push(`/songlists/${audioData.id}`);
      // 修改 audio id
      // useChangeAudioIdHooks(audioData.id);
      // // 添加到 播放列表中
      // useAddAudioListHooks(audioData);
      // (this as any).$bus.emit("audioPlay");
    },
    // 最新音乐点击
    latestMusicClickHandle(latestMusic: any) {
      console.log(latestMusic);
      let { id, name, song, picUrl } = latestMusic;
      let audioInfo: AudioInfoInterface = {
        id: id,
        songName: name,
        artistName: song.artists[0].name,
        playTime: song.bMusic.playTime,
        picUrl: picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id: id });
      store.commit(AUDIO_INFO_CHANGE, {
        audioInfo: audioInfo,
      });
      store.commit(AUDIO_LIST_ADD, {
        audioData: audioInfo,
      });
      // 触发播放音频
      (this as any).$bus.emit("audioPlay");
    },
    // 点击推荐歌单title事件
    clickTitleHandle() {
      this.$router.push("/discover/songSheet");
    },
  }, */
});
</script>


<style lang="less" scoped>
.recommend-page {
  /* margin: 0 auto;
  width: 1260px; */
  .recommend-banner {
    margin-bottom: 1.5rem;
  }
  .recommend-song-sheet {
    margin-bottom: 7rem;
    .recommend-song-sheet-title {
      cursor: pointer;
      color: #707070;
      &:hover {
        color: #525252;
      }
    }
    .recommend-song-content {
      height: 34rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
    }
  }

  // 最新音乐
  .recommend-latest-music {
    .recommend-latest-music-content {
      width: 100%;
      height: 32rem;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      box-sizing: border-box;
    }
  }
}
</style>