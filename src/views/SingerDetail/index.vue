<!--
 * @Author: your name
 * @Date: 2021-01-22 13:21:34
 * @LastEditTime: 2021-01-22 23:04:51
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
    <!-- 热门音乐 50首 -->
    <div class="singer-detail-hot-songs">
      <album-detail-com :title="'热门音乐'" :data="hotSongs"></album-detail-com>
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
          ></album-detail-com>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// vue
import { defineComponent } from "vue";
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

export default defineComponent({
  name: "SingerDetail",
  components: {
    AlbumDetailCom,
  },
  data() {
    return {
      artistInfo: {} as artistInfoInterface, // 歌手信息
      hotSongs: [], // 热门歌曲50首
      albumArr: [], // 专辑数组
      page: 1, // 专辑页面数
      scrollEle: "main",
      hasNextAlbumData: true,
    };
  },
  mounted() {
    let _this = this as any;
    let id = _this.$route.params.id;
    // 获取作者信息和热门歌曲
    getArtistInfo(id).then((res) => {
      console.log("getArtistInfo", res);
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
          let songerInfo: songInfoInterface = {
            id: song.id,
            name: song.name,
            index:
              (index + 1).toString().length >= 2
                ? (index + 1).toString()
                : `0${index + 1}`,
            time: numberToTimeFormat(song.dt / 1000),
          };
          return songerInfo;
        });
      }
    });
    // 获取首条专辑
    _this.getAlbumDataInfo(id, _this.page);
  },
  methods: {
    // 滚动到底部触发事件
    load() {
      let _this = this as any;
      let id = _this.$route.params.id;
      _this.page++;
      _this.getAlbumDataInfo(id, _this.page);

    },
    // 请求获取专辑信息
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
                      let songInfo: songInfoInterface = {
                        id: song.id,
                        name: song.name,
                        index:
                          (index + 1).toString().length >= 2
                            ? (index + 1).toString()
                            : `0${index + 1}`,
                        time: numberToTimeFormat(song.dt / 1000),
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
    },
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
      .singer-detail-album-left {
        flex: 0.3;
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
}
</style>