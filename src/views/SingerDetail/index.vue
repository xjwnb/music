<!--
 * @Author: your name
 * @Date: 2021-01-22 13:21:34
 * @LastEditTime: 2021-01-25 13:35:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\SingerDetail\index.vue
-->
<template>
  <div class="singer-detail" v-scroll:[scrollEle]="load">
    <!-- 歌手信息 -->
    <div class="singer-detail-singerInfo">
      <div class="singer-detail-singerInfo-picUrl">
        <el-image :src="artistInfo.picUrl"></el-image>
      </div>
      <div class="singer-detail-singerInfo-content">
        <div class="singer-detail-singerInfo-content-name">
          <h1>{{ artistInfo.name }}</h1>
        </div>
        <div class="singer-detail-singerInfo-content-alias">
          {{ artistInfo.alias }}
        </div>
        <div class="singer-detail-singerInfo-content-works-size">
          <span>单曲数：{{ artistInfo.musicSize }}</span>
          <span>专辑数：{{ artistInfo.albumSize }}</span>
          <span>MV数：{{ artistInfo.mvSize }}</span>
        </div>
      </div>
    </div>
    <!-- 标签 -->
    <div class="singer-detail-tags">
      <div
        v-for="(tag, index) in tags"
        :key="index"
        :class="['singer-detail-tag', currentTag === tag ? 'active' : '']"
        @click="changeTagHandle(tag)"
      >
        {{ tag }}
      </div>
    </div>
    <div v-show="currentTag === '专辑'" class="singer-detail-album">
      <!-- 热门音乐 50首 -->
      <div class="singer-detail-hot-songs">
        <album-detail-com
          :title="'热门音乐'"
          :data="hotSongs"
          @db-click="dbClickHandle"
        ></album-detail-com>
      </div>
      <!-- 专辑 -->
      <div class="singer-detail-album-content">
        <div
          class="singer-detail-album"
          v-for="(album, key) in albumArr"
          :key="album.ablumnInfo.id"
        >
          <div class="singer-detail-album-left">
            <el-image :src="album.ablumnInfo.picUrl"></el-image>
            <div class="singer-detail-album-publishTime">
              {{ album.ablumnInfo.publishTime }}
            </div>
          </div>
          <div class="singer-detail-album-right">
            <album-detail-com
              :title="album.ablumnInfo.name"
              :data="album.songs"
              @db-click="dbClickHandle"
            ></album-detail-com>
          </div>
        </div>
      </div>
    </div>
    <div v-show="currentTag !== '专辑'" class="singer-detial-desc">
      <p class="singer-detail-briefDesc">{{ briefDesc }}</p>
      <div
        v-for="introducte in introduction"
        :key="introducte.ti"
        class="singer-detail-desc-"
      >
        <h2>{{ introducte.ti }}</h2>
        <p>{{ introducte.txt }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// vue
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
} from "vue";
// 请求
import {
  getArtistInfo,
  getArtistDescInfo,
  getArtistAlbumInfo,
  getArtistAlbum,
} from "@/api/SingerDetail";
// interface
import {
  artistInfoInterface,
  songInfoInterface,
} from "@/interface/views/singerDetail";
// utils
import { numberToTimeFormat, numberToDateFormat } from "@/utils/numberFormat";
// 组件
import { AlbumDetailCom } from "@/components";
// vuex
import store from "@/store";
import {
  AUDIO_ID_CHANGE,
  AUDIO_LIST_ADD,
  AUDIO_INFO_CHANGE,
} from "@/store/mutation-types";
// interface
import { AudioInfoInterface } from "@/interface/public/audio";

// interface
interface albumInfoInterface {
  ablumnInfo: any;
  songs: any;
}

export default defineComponent({
  name: "SingerDetail",
  components: {
    AlbumDetailCom,
  },
  /* data() {
    return {
      artistInfo: {} as artistInfoInterface, // 歌手信息
      hotSongs: [], // 热门歌曲50首
      albumArr: [], // 专辑数组
      page: 1, // 专辑页面数
      scrollEle: "main", // 滚动条所在的标签
      hasNextAlbumData: true, // 判断是否有下一个专辑（防止多余的加载请求）
      currentTag: "专辑",
      tags: ["专辑", "歌手详情"],
      briefDesc: "", // 歌手描述
      introduction: [], // 其他描述
      id: 0, // 歌手 ID
    };
  }, */
  setup() {
    const artistInfo = ref<artistInfoInterface | object>({}); // 歌手信息
    const hotSongs = ref([]); // 热门歌曲50首
    const albumArr = ref<albumInfoInterface[]>([]); // 专辑数组
    const page = ref(1); // 专辑页面数
    const scrollEle = ref("main"); // 滚动条所在的标签
    const hasNextAlbumData = ref(true); // 判断是否有下一个专辑（防止多余的加载请求）
    const currentTag = ref("专辑");
    const tags = ref(["专辑", "歌手详情"]);
    const briefDesc = ref(""); // 歌手描述
    const introduction = ref([]); // 其他描述
    const id = ref(0); // 歌手 ID

    const instance: any = getCurrentInstance();
    const root = instance.ctx.$root;

    onMounted(() => {
      let ids = root.$route.params.id;
      id.value = ids;
      // 获取作者信息和热门歌曲
      getArtistInfo(ids).then((res) => {
        let data = (res as any).data;
        let artist = data.artist;
        if (data.code === 200) {
          let artistInfo1: artistInfoInterface = {
            id: artist.id,
            name: artist.name,
            alias: artist.alias[0],
            musicSize: artist.musicSize,
            albumSize: artist.albumSize,
            mvSize: artist.mvSize,
            picUrl: artist.img1v1Url,
          };
          artistInfo.value = artistInfo1;
          hotSongs.value = data.hotSongs.map((song: any, index: number) => {
            let songerInfo = {
              id: song.id,
              // name: song.name,
              // index:
              //   (index + 1).toString().length >= 2
              //     ? (index + 1).toString()
              //     : `0${index + 1}`,
              // time: numberToTimeFormat(song.dt / 1000),
              index:
                (index + 1).toString().length >= 2
                  ? (index + 1).toString()
                  : `0${index + 1}`,
              songName: song.name,
              name: song.name,
              artistName: song.ar[0].name,
              playTime: song.dt,
              time: numberToTimeFormat(song.dt / 1000),
              picUrl: song.al.picUrl,
            };
            return songerInfo;
          });
        }
      });
      // 获取首条专辑
      getAlbumDataInfo(ids, page.value);
    });

    // methodes
    // 滚动到底部触发事件
    const load = () => {
      if (currentTag.value === "专辑") {
        let id = root.$route.params.id;
        page.value++;
        getAlbumDataInfo(id, page.value);
      }
    };
    // 请求获取专辑信息
    const getAlbumDataInfo = (id: number, page: number) => {
      if (hasNextAlbumData.value) {
        getArtistAlbumInfo(id, page)
          .then((res) => {
            let data = (res as any).data;
            let { hotAlbums } = data;
            let albumInfo;
            if (data.code === 200) {
              if (hotAlbums[0]) {
                albumInfo = {
                  id: hotAlbums[0].id,
                  name: hotAlbums[0].name,
                  publishTime: numberToDateFormat(hotAlbums[0].publishTime),
                  picUrl: hotAlbums[0].picUrl,
                };
                return albumInfo;
              } else {
                hasNextAlbumData.value = false;
              }
            }
          })
          .then((album: any) => {
            let albumInfo: albumInfoInterface;
            if (album) {
              getArtistAlbum(album.id).then((res) => {
                let data = (res as any).data;
                if (data.code === 200) {
                  let albumSongs = data.songs.map(
                    (song: any, index: number) => {
                      let songInfo = {
                        id: song.id,
                        index:
                          (index + 1).toString().length >= 2
                            ? (index + 1).toString()
                            : `0${index + 1}`,
                        songName: song.name,
                        artistName: song.ar[0].name,
                        playTime: song.dt,
                        time: numberToTimeFormat(song.dt / 1000),
                        picUrl: song.al.picUrl,
                        name: song.name,
                        // name: song.name,
                        // index:
                        //   (index + 1).toString().length >= 2
                        //     ? (index + 1).toString()
                        //     : `0${index + 1}`,
                        // time: numberToTimeFormat(song.dt / 1000),
                      };
                      return songInfo;
                    }
                  );
                  albumInfo = {
                    ablumnInfo: album,
                    songs: albumSongs,
                  };
                  albumArr.value.push(albumInfo);
                }
              });
            } else {
              hasNextAlbumData.value = false;
            }
          });
      }
    };
    // 双击表单事件
    const dbClickHandle = (rowData: any, column: any, event: any) => {
      let { id, picUrl, artistName, songName, playTime } = rowData;
      let audioData: AudioInfoInterface;
      audioData = {
        id,
        songName: songName,
        artistName: artistName,
        playTime,
        picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id });
      store.commit(AUDIO_INFO_CHANGE, { audioInfo: audioData });
      store.commit(AUDIO_LIST_ADD, { audioData });
      root.$bus.emit("audioPlay");
    };

    // 标签修改
    const changeTagHandle = (tag: string) => {
      currentTag.value = tag;
      if (!briefDesc.value) {
        getArtistDescInfo(id.value).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            briefDesc.value = data.briefDesc;
            introduction.value = data.introduction;
          }
        });
      }
    };


    return {
      artistInfo, // 歌手信息
      hotSongs, // 热门歌曲50首
      albumArr, // 专辑数组
      page, // 专辑页面数
      scrollEle, // 滚动条所在的标签
      hasNextAlbumData, // 判断是否有下一个专辑（防止多余的加载请求）
      currentTag,
      tags,
      briefDesc, // 歌手描述
      introduction, // 其他描述
      id, // 歌手 ID


      // methods
      load,
      getAlbumDataInfo,
      dbClickHandle,
      changeTagHandle,
    }
  },
  /* mounted() {
    let _this = this as any;
    let id = _this.$route.params.id;
    _this.id = id;
    // 获取作者信息和热门歌曲
    getArtistInfo(id).then((res) => {
      let data = (res as any).data;
      let artist = data.artist;
      if (data.code === 200) {
        let artistInfo: artistInfoInterface = {
          id: artist.id,
          name: artist.name,
          alias: artist.alias[0],
          musicSize: artist.musicSize,
          albumSize: artist.albumSize,
          mvSize: artist.mvSize,
          picUrl: artist.img1v1Url,
        };
        _this.artistInfo = artistInfo;
        _this.hotSongs = data.hotSongs.map((song: any, index: number) => {
          let songerInfo = {
            id: song.id,
            // name: song.name,
            // index:
            //   (index + 1).toString().length >= 2
            //     ? (index + 1).toString()
            //     : `0${index + 1}`,
            // time: numberToTimeFormat(song.dt / 1000),
            index:
              (index + 1).toString().length >= 2
                ? (index + 1).toString()
                : `0${index + 1}`,
            songName: song.name,
            name: song.name,
            artistName: song.ar[0].name,
            playTime: song.dt,
            time: numberToTimeFormat(song.dt / 1000),
            picUrl: song.al.picUrl,
          };
          return songerInfo;
        });
      }
    });
    // 获取首条专辑
    _this.getAlbumDataInfo(id, _this.page);
  }, */
  methods: {
    /* // 滚动到底部触发事件
    load() {
      let _this = this as any;
      if (_this.currentTag === "专辑") {
        let id = _this.$route.params.id;
        _this.page++;
        _this.getAlbumDataInfo(id, _this.page);
      }
    }, */
    /* // 请求获取专辑信息
    getAlbumDataInfo(id: number, page: number) {
      let _this = this as any;
      if (_this.hasNextAlbumData) {
        getArtistAlbumInfo(id, page)
          .then((res) => {
            let data = (res as any).data;
            let { hotAlbums } = data;
            let albumInfo;
            if (data.code === 200) {
              if (hotAlbums[0]) {
                albumInfo = {
                  id: hotAlbums[0].id,
                  name: hotAlbums[0].name,
                  publishTime: numberToDateFormat(hotAlbums[0].publishTime),
                  picUrl: hotAlbums[0].picUrl,
                };
                return albumInfo;
              } else {
                _this.hasNextAlbumData = false;
              }
            }
          })
          .then((album: any) => {
            let albumInfo = {};
            if (album) {
              getArtistAlbum(album.id).then((res) => {
                let data = (res as any).data;
                if (data.code === 200) {
                  let albumSongs = data.songs.map(
                    (song: any, index: number) => {
                      let songInfo = {
                        id: song.id,
                        index:
                          (index + 1).toString().length >= 2
                            ? (index + 1).toString()
                            : `0${index + 1}`,
                        songName: song.name,
                        artistName: song.ar[0].name,
                        playTime: song.dt,
                        time: numberToTimeFormat(song.dt / 1000),
                        picUrl: song.al.picUrl,
                        name: song.name,
                        // name: song.name,
                        // index:
                        //   (index + 1).toString().length >= 2
                        //     ? (index + 1).toString()
                        //     : `0${index + 1}`,
                        // time: numberToTimeFormat(song.dt / 1000),
                      };
                      return songInfo;
                    }
                  );
                  albumInfo = {
                    ablumnInfo: album,
                    songs: albumSongs,
                  };
                  _this.albumArr.push(albumInfo);
                }
              });
            } else {
              _this.hasNextAlbumData = false;
            }
          });
      }
    }, */
    /* // 双击表单事件
    dbClickHandle(rowData: any, column: any, event: any) {
      let { id, picUrl, artistName, songName, playTime } = rowData;
      let audioData: AudioInfoInterface;
      audioData = {
        id,
        songName: songName,
        artistName: artistName,
        playTime,
        picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id });
      store.commit(AUDIO_INFO_CHANGE, { audioInfo: audioData });
      store.commit(AUDIO_LIST_ADD, { audioData });
      (this as any).$bus.emit("audioPlay");
    }, */
    /* // 标签修改
    changeTagHandle(tag: string) {
      let _this = this as any;
      _this.currentTag = tag;
      if (!_this.briefDesc) {
        getArtistDescInfo(_this.id).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            _this.briefDesc = data.briefDesc;
            _this.introduction = data.introduction;
          }
        });
      }
    }, */
  },
});
</script>

<style lang="less" scoped>
.singer-detail {
  // 内容
  .singer-detail-singerInfo {
    display: flex;
    .singer-detail-singerInfo-picUrl {
      margin-right: 2rem;
      .el-image {
        width: 15rem;
        height: 15rem;
        border-radius: 0.5rem;
      }
    }
    .singer-detail-singerInfo-content {
      .singer-detail-singerInfo-content-name {
        margin: 1rem 0;
        h1 {
          margin: 0;
          font-size: 1.7rem;
        }
      }
      .singer-detail-singerInfo-content-alias {
        color: #666464;
        margin: 0 0 1rem;
      }
      .singer-detail-singerInfo-content-works-size {
        span {
          margin-right: 2rem;
        }
      }
    }
  }
  // 专辑
  .singer-detail-album-content {
    .singer-detail-album {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 2rem;
      .singer-detail-album-left {
        flex: 0.3;
        display: flex;
        flex-direction: column;
        align-items: center;
        .el-image {
          width: 15rem;
          height: 15rem;
          border-radius: 0.5rem;
        }
      }
      .singer-detail-album-right {
        flex: 0.7;
      }
    }
  }
  // 标签
  .singer-detail-tags {
    display: flex;
    .singer-detail-tag {
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    .active {
      border-bottom: 1px solid #fa6e6e;
    }
  }
  // 描述
  .singer-detial-desc {
    p {
      text-indent: 2rem;
    }
    .singer-detail-briefDesc {
      font-size: 0.8rem;
      color: #7e7e7e;
    }
  }
}
</style>