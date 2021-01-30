<!--
 * @Author: your name
 * @Date: 2021-01-27 12:43:13
 * @LastEditTime: 2021-01-30 12:17:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\SearchKeyword\index.vue
-->
<template>
  <div class="search-keyword">
    <!-- result count -->
    <div class="search-keyword-count">
      <h2 v-show="currentTag === '单曲'">
        找到{{ currentResult && currentResult.count }}首单曲
      </h2>
      <h2 v-show="currentTag === '歌手'">
        找到{{ currentResult && currentResult.count }}位歌手
      </h2>
      <h2 v-show="currentTag === '歌单'">
        找到{{ currentResult && currentResult.count }}个歌单
      </h2>
    </div>
    <div class="search-keyword-tabs">
      <tabs-com :data="tabs" @click="clickTabHandle"></tabs-com>
    </div>

    <!-- 单曲 -->
    <div v-show="currentTag === '单曲'" class="search-keyword-songs-table">
      <el-table
        :data="currentResult && currentResult.result"
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
    <!-- 歌手 -->
    <div v-show="currentTag === '歌手'" class="search-keyword-songs-artists">
      <div
        v-if="currentResult && currentResult.result"
        class="search-keyword-songs-artist-div"
      >
        <div
          v-for="res in currentResult.result"
          class="search-keyword-songs-artist"
          @click="clickSingerHandle(res.id)"
        >
          <div class="search-keyword-songs-artist-image">
            <el-image :src="res.picUrl"></el-image>
          </div>
          <div class="search-keyword-songs-artist-name">
            {{ res.name }}
          </div>
        </div>
      </div>
    </div>
    <!-- 歌单 -->
    <div v-show="currentTag === '歌单'" class="search-keyword-songs-albums">
      <div
        v-if="currentResult && currentResult.result"
        class="search-keyword-songs-album-div"
      >
        <div
          v-for="res in currentResult.result"
          class="search-keyword-songs-album"
          @click="clickPlayListHandle(res.id)"
        >
          <div class="search-keyword-songs-album-info">
            <div class="search-keyword-songs-album-image">
              <el-image :src="res.picUrl"></el-image>
            </div>
            <div class="search-keyword-songs-album-name">
              {{ res.name }}
            </div>
          </div>
          <div class="search-keyword-songs-album-artistName">
            {{ res.artistName }}
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="currentPage"
      background
      layout="prev, pager, next"
      :total="currentResult && currentResult.count"
      :page-size="100"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>


<script lang="ts">
// songlist interface
import {
  songlistInterface,
  songlistCommentInterface,
} from "@/interface/views/songlist";
// utils
import {
  numberFormat,
  numberToDateFormat,
  numberToTimeFormat,
  numberToTimeDistanceFormat,
} from "@/utils/numberFormat";
// 组件
import { TabsCom } from "@/components";
// 请求
import { searchKeywordGetResult } from "@/api/SearchKeyword";
// interface
import { AudioInfoInterface } from "@/interface/public/audio";
// vuex
import store from "@/store";
import {
  AUDIO_ID_CHANGE,
  AUDIO_LIST_ADD,
  AUDIO_INFO_CHANGE,
} from "@/store/mutation-types";
import { AUDIO_ID, AUDIO_INFO, AUDIO_LIST } from "@/store/state-types";
// 接口
import { tabsInterface } from "@/interface/views/tab";

import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  watch,
} from "vue";

export default defineComponent({
  name: "SearchKeywod",
  components: {
    TabsCom,
  },
  setup() {
    const instance: any = getCurrentInstance();
    const root = instance.proxy;
    const keyword = ref(root.$route.query.keyword);
    // const keyword =
    // 标签
    const tabs = reactive<tabsInterface[]>([
      {
        id: 1,
        name: "单曲",
        alias: "songs",
        type: 1,
      },
      {
        id: 2,
        name: "歌手",
        alias: "artists",
        type: 100,
      },
      /* {
        id: 3,
        name: "专辑",
        alias: "albums",
        type: 10,
      }, */
      {
        id: 4,
        name: "歌单",
        alias: "playlists",
        type: 1000,
      },
    ]);
    const currentTag = ref("单曲");
    const currentIndex = ref(0);
    const searchResult: any = ref({});
    const currentResult: any = ref(null);
    const currentPage = ref(1);

    let currentAlias: any = ref(tabs[currentIndex.value].alias);
    const currentType: any = ref(tabs[currentIndex.value].type);

    watch(
      () => root.$route,
      () => {
        keyword.value = root.$route.query.keyword;
        root.$router.go(0)
        /* root.$router.push({
          path: "search",
          query: { keyword: keyword.value },
        }); */
      }
    );

    // mounted
    onMounted(() => {
      let loading = root.$loading({
        target: document.getElementsByClassName("search-keyword")[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (searchResult.value[currentAlias.value] === undefined) {
        searchResult.value[currentAlias.value] = {};
        searchKeywordGetResult(keyword.value, currentType.value).then((res) => {
          let data: any = (res as any).data;
          if (data.code === 200) {
            // searchResult
            let songsData: songlistInterface[] = data.result[
              currentAlias.value
            ].map((song: any, index: number) => {
              return {
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
            });
            searchResult.value[currentAlias.value].result = songsData;
            for (let key in data.result) {
              if (typeof data.result[key] === "number") {
                searchResult.value[currentAlias.value].count = data.result[key];
              }
            }
            // console.log("searchResult", searchResult.value);
            currentResult.value = searchResult.value[currentAlias.value];
            loading.close();
          }
        });
      } else {
        currentResult.value.result = searchResult.value[
          currentAlias.value
        ].result.filters((result: any, index: number) => {
          return index < 100;
        });
        currentResult.value.count =
          searchResult.value[currentAlias.value].count;
        loading.close();
      }
    });

    // methods
    // 点击标签事件
    const clickTabHandle = (tabData: any, index: number) => {
      currentTag.value = tabData.name;
      currentIndex.value = index;
      currentPage.value = 1;
      currentAlias.value = tabs[currentIndex.value].alias;
      currentType.value = tabs[currentIndex.value].type;
      if (searchResult.value[currentAlias.value] === undefined) {
        searchResult.value[currentAlias.value] = {};
        searchKeywordGetResult(keyword.value, currentType.value).then((res) => {
          let data: any = (res as any).data;
          if (data.code === 200) {
            for (let key in data.result) {
              if (typeof data.result[key] === "number") {
                searchResult.value[currentAlias.value].count = data.result[key];
              } else if (typeof data.result[key] === "object") {
                switch (key) {
                  case "artists":
                    let artistsData = data.result[currentAlias.value].map(
                      (artist: any, index: number) => {
                        return {
                          id: artist.id,
                          name: artist.name,
                          picUrl: artist.picUrl,
                        };
                      }
                    );
                    searchResult.value[currentAlias.value].result = artistsData;
                    currentResult.value =
                      searchResult.value[currentAlias.value];
                    break;
                  case "songs":
                    break;

                  case "playlists":
                    let playlistsData = data.result[currentAlias.value].map(
                      (playlist: any, index: number) => {
                        return {
                          id: playlist.id,
                          name: playlist.name,
                          artistName: playlist.creator.nickname,
                          picUrl: playlist.coverImgUrl,
                        };
                      }
                    );
                    searchResult.value[
                      currentAlias.value
                    ].result = playlistsData;
                    currentResult.value =
                      searchResult.value[currentAlias.value];
                    break;
                }
              }
            }
          }
        });
      } else {
        currentResult.value = {};
        currentResult.value.count =
          searchResult.value[currentAlias.value].count;
        let result = searchResult.value[currentAlias.value].result.filter(
          (res: any, index: number) => {
            return index < 100;
          }
        );
        currentResult.value.result = result;
      }
    };

    // 双击点击table
    const dbTableClickHandle = (tableData: any) => {
      let { id, picUrl, songer, title, playTime } = tableData;
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

    // 分页
    const handleCurrentChange = (val: number) => {
      let loading = root.$loading({
        target: document.getElementsByClassName("search-keyword")[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      /* if (
        searchResult.value[currentAlias.value].result[(val - 1) * 100] ===
        undefined
      ) { */
      searchKeywordGetResult(
        keyword.value,
        currentType.value,
        (currentPage.value - 1) * 100
      ).then((res) => {
        let data: any = (res as any).data;
        if (data.code === 200) {
          // searchResult
          /* let songsData: songlistInterface[] = data.result[
              currentAlias.value
            ].map((song: any, index: number) => {
              return {
                num:
                  (index + 1 + (currentPage.value - 1) * 100).toString()
                    .length >= 2
                    ? (index + 1 + (currentPage.value - 1) * 100).toString()
                    : `0${index + 1}`,
                id: song.id,
                title: song.name,
                picUrl: song.al.picUrl,
                songer: song.ar[0].name,
                album: song.al.name,
                playTimeFormat: numberToTimeFormat(song.dt / 1000),
                playTime: song.dt,
              };
            });
            searchResult.value[currentAlias.value].result = songsData;
            for (let key in data.result) {
              if (typeof data.result[key] === "number") {
                searchResult.value[currentAlias.value].count = data.result[key];
              }
            }
            // console.log("searchResult", searchResult.value);
            currentResult.value = searchResult.value[currentAlias.value]; */
          for (let key in data.result) {
            if (typeof data.result[key] === "object") {
              switch (key) {
                // 歌手
                case "artists":
                  let artistsData = data.result[currentAlias.value].map(
                    (artist: any, index: number) => {
                      let artists = {
                        id: artist.id,
                        name: artist.name,
                        picUrl: artist.picUrl,
                      };
                      searchResult.value[currentAlias.value].result[
                        (currentPage.value - 1) * 100 + index
                      ] = artists;
                      return artists;
                    }
                  );
                  /* searchResult.value[currentAlias.value].result.push(
                      artistsData
                    ); */
                  /* currentResult.value =
                      searchResult.value[currentAlias.value]; */
                  currentResult.value.count =
                    searchResult.value[currentAlias.value].count;
                  currentResult.value.result = artistsData;
                  break;
                // 单曲
                case "songs":
                  let songsData: songlistInterface[] = data.result[
                    currentAlias.value
                  ].map((song: any, index: number) => {
                    let songs = {
                      num:
                        (index + 1 + (currentPage.value - 1) * 100).toString()
                          .length >= 2
                          ? (
                              index +
                              1 +
                              (currentPage.value - 1) * 100
                            ).toString()
                          : `0${index + 1}`,
                      id: song.id,
                      title: song.name,
                      picUrl: song.al.picUrl,
                      songer: song.ar[0].name,
                      album: song.al.name,
                      playTimeFormat: numberToTimeFormat(song.dt / 1000),
                      playTime: song.dt,
                    };
                    // console.log((currentPage.value - 1) * 100 + index + 1);
                    searchResult.value[currentAlias.value].result[
                      (currentPage.value - 1) * 100 + index
                    ] = songs;
                    // console.log(searchResult.value[currentAlias.value].result[(currentPage.value - 1) * 100 + index + 1]);

                    return songs;
                  });
                  /* for (let key in data.result) {
                      if (typeof data.result[key] === "number") {
                        searchResult.value[currentAlias.value].count =
                          data.result[key];
                      }
                    } */
                  // console.log("searchResult", searchResult.value);
                  currentResult.value.count =
                    searchResult.value[currentAlias.value].count;
                  currentResult.value.result = songsData;
                  break;
                // 歌单
                case "playlists":
                  let playlistsData = data.result[currentAlias.value].map(
                    (playlist: any, index: number) => {
                      let plays = {
                        id: playlist.id,
                        name: playlist.name,
                        artistName: playlist.creator.nickname,
                        picUrl: playlist.coverImgUrl,
                      };
                      searchResult.value[currentAlias.value].result[
                        (currentPage.value - 1) * 100 + index
                      ] = plays;
                      return plays;
                    }
                  );
                  currentResult.value.count =
                    searchResult.value[currentAlias.value].count;
                  currentResult.value.result = playlistsData;
                  break;
                /*searchResult.value[
                      currentAlias.value
                    ].result = playlistsData;
                    currentResult.value =
                      searchResult.value[currentAlias.value]; */
              }
            }
          }
          loading.close();
        }
      });
      /* } else {
        // currentResult.value = {};
        currentResult.value.count =
          searchResult.value[currentAlias.value].count;
        // currentResult.value.result = [];
        // currentResult.value.result = searchResult.value[currentAlias.value]
        let currentPageNum =
          searchResult.value[currentAlias.value].count -
          (currentPage.value - 1) * 100;

        if (currentPageNum > 100) {
          console.log(currentResult.value);
          // for (let i = 0, l = 100; i < l; i++) {
          //   currentResult.value.result[i] =
          //     searchResult.value.result[(val - 1) * 100 + i];
          // }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            currentResult.value.result[ii] =
              searchResult.value.result[(val - 1) * 100 + ii];
          }
        }
      } */
    };

    // 点击歌手事件
    const clickSingerHandle = (id: number) => {
      root.$router.push(`/singerDetial/${id}`);
    };
    // 点击歌单事件
    const clickPlayListHandle = (id: number) => {
      root.$router.push(`/songlists/${id}`);
    };

    return {
      keyword,
      tabs,
      clickTabHandle,
      currentTag,
      searchResult,
      currentResult,
      dbTableClickHandle,
      currentPage,
      currentAlias,
      currentType,
      // methods
      handleCurrentChange,
      clickSingerHandle,
      clickPlayListHandle,
    };
  },
});
</script>

<style lang="less" scoped>
.search-keyword {
  .search-keyword-tabs {
    margin: 20px 0;
  }
  .search-keyword-songs-artists {
    .search-keyword-songs-artist-div {
      .search-keyword-songs-artist {
        display: flex;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        cursor: pointer;
        &:nth-child(2n) {
          background-color: #f9f9f9;
        }
        &:hover {
          background-color: #f0f1f2;
        }
        .search-keyword-songs-artist-image {
          margin-right: 20px;
          .el-image {
            width: 70px;
            height: 70px;
            border-radius: 3px;
          }
        }
      }
    }
  }
  // 专辑
  .search-keyword-songs-albums {
    .search-keyword-songs-album-div {
      width: 100%;
      .search-keyword-songs-album {
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        cursor: pointer;
        &:nth-child(2n) {
          background-color: #f9f9f9;
        }
        &:hover {
          background-color: #f0f1f2;
        }
        .search-keyword-songs-album-info {
          display: flex;
          align-items: center;
          width: 300px;
          text-overflow: ellipsis;
          .search-keyword-songs-album-image {
            margin-right: 20px;
            .el-image {
              width: 70px;
              height: 70px;
              border-radius: 3px;
            }
          }
        }
        .search-keyword-songs-album-artistName {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
}
</style>