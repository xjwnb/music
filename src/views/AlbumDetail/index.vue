<!--
 * @Author: your name
 * @Date: 2021-01-29 17:04:30
 * @LastEditTime: 2021-01-29 23:46:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\AlbumDetail\index.vue
-->
<template>
  <div class="album-detail">
    <!-- 专辑大致信息 -->
    <div class="album-detail-info">
      <div class="album-detail-info-image">
        <el-image :src="albumInfo.picUrl"></el-image>
      </div>
      <div class="album-detail-info-msg">
        <div class="album-detail-info-msg-albumname">
          <h2>{{ albumInfo.name }}</h2>
        </div>
        <div class="album-detail-info-msg-artist">
          歌手：<span>{{ albumInfo.artistName }} </span>
        </div>
        <div class="album-detail-info-msg-time">
          时间：<span>{{ albumInfo.publishTime }}</span>
        </div>
      </div>
    </div>
    <!-- tab 标签 -->
    <div class="album-detail-tabs">
      <tabs-com :data="tabsData" @click="clickTabHandle"></tabs-com>
    </div>
    <!-- 内容 -->
    <div class="album-detail-content">
      <div v-show="currentAlias === 'songs'" class="album-detail-songs">
        <el-table
          :data="songsData"
          stripe
          style="width: 100%"
          @row-dblclick="dbTableClickHandle"
        >
          <el-table-column prop="num" width="180"> </el-table-column>
          <el-table-column prop="title" label="音乐标题" width="180">
          </el-table-column>
          <el-table-column prop="songer" label="歌手"></el-table-column>
          <el-table-column prop="album" label="专辑"></el-table-column>
          <el-table-column prop="playTimeFormat" label="时长"></el-table-column>
        </el-table>
      </div>
      <div
        v-show="currentAlias === 'description'"
        class="album-detail-description"
      >
        <h3>专辑介绍</h3>
        <div v-for="(desc, index) in descript" :key="index" class="album-detail-description-item">
          {{ desc }}
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
} from "vue";
// 请求
import { getAlbumById } from "@/api/albumDetail";
// utils
import {
  numberToDateFormat,
  numberToTimeFormat,
} from "@/utils/numberFormat";
// 接口
import { tabsInterface } from "@/interface/views/tab";
// 组件
import { TabsCom } from "@/components";
// songlist interface
import {
  songlistInterface,
  songlistCommentInterface,
} from "@/interface/views/songlist";
// vuex
import store from "@/store";
import {
  AUDIO_ID_CHANGE,
  AUDIO_LIST_ADD,
  AUDIO_INFO_CHANGE,
} from "@/store/mutation-types";
import { AUDIO_ID, AUDIO_INFO, AUDIO_LIST } from "@/store/state-types";
// interface
import { AudioInfoInterface } from "@/interface/public/audio";

export default defineComponent({
  name: "AlbumDetail",
  components: {
    TabsCom,
  },
  setup() {
    const instance: any = getCurrentInstance();
    const root = instance.ctx.$root;

    const id = root.$route.params.id;

    const albumInfo: any = reactive({});
    const descript = reactive<String[]>([]); // 专辑描述
    const tabsData = reactive<tabsInterface[]>([
      {
        id: 1,
        name: "歌曲列表",
        alias: "songs",
      },
      {
        id: 2,
        name: "专辑描述",
        alias: "description",
      },
    ]);
    const currentAlias = ref<String>("songs");
    let songsData = reactive<songlistInterface[]>([]);

    onMounted(() => {
      const loading = root.$loading({
        target: document.getElementsByClassName(
          "album-detail"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      getAlbumById(id).then((res) => {
        const data = (res as any).data;
        if (data.code === 200) {
          let {
            id,
            name,
            publishTime,
            picUrl,
            artist,
            description,
          } = data.album;
          console.log(data);
          albumInfo.id = id;
          albumInfo.name = name;
          albumInfo.publishTime = numberToDateFormat(publishTime);
          albumInfo.picUrl = picUrl;
          albumInfo.artistName = artist.name;
          const descriptArr = description.split("\n");
          descriptArr.forEach((desc: string) => {
            descript.push(desc);
          })
          // songs
          const songs = Object.assign([], data.songs);
          const songs1: songlistInterface[] = songs.forEach(
            (song: any, index: number) => {
              let songitem:songlistInterface = {
                num:
                  (index + 1).toString().length >= 2
                    ? (index + 1).toString()
                    : `0${index + 1}`,
                id: song.id,
                title: song.name,
                picUrl: song.al.picUrl,
                songer: song.ar[0].name,
                album: song.al.name,
                playTimeFormat: numberToTimeFormat(song.dt / 1000),
                playTime: song.dt,
              };
              songsData.push(songitem);
            }
          );
          loading.close();
        }
      });
    });

    // methods
    // 点击标签事件
    const clickTabHandle = (data: any) => {
      currentAlias.value = data.alias;
    };

    // 专辑表格事件
    const dbTableClickHandle = (data: any): void  => {
      let { id, picUrl, songer, title, playTime } = data;
      let audioData: AudioInfoInterface;
      audioData = {
        id,
        songName: title,
        artistName: songer,
        playTime,
        picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id });
      store.commit(AUDIO_INFO_CHANGE, { audioInfo: audioData });
      store.commit(AUDIO_LIST_ADD, { audioData });
      root.$bus.emit("audioPlay");
    };

    return {
      albumInfo,
      descript,
      tabsData,
      currentAlias,
      songsData,
      // methods
      clickTabHandle,
      dbTableClickHandle,
    };
  },
});
</script>

<style lang="less" scoped>
.album-detail {
  .album-detail-info {
    display: flex;
    margin: 10px 0 20px;
    .album-detail-info-image {
      margin-right: 25px;
      .el-image {
        width: 200px;
        height: 200px;
        border-radius: 5px;
      }
    }
  }
  .album-detail-tabs {
    margin: 0 0 2rem;
  }
  .album-detail-content {
    margin-bottom: 20px;
    .album-detail-description {
      .album-detail-description-item {
        margin: 0 0 10px;
        text-indent: 2rem;
      }
    }
  }
}
</style>