<!--
 * @Author: your name
 * @Date: 2021-01-18 15:52:02
 * @LastEditTime: 2021-01-25 18:02:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\TopPlaylist\index.vue
-->
<template>
  <div class="top-playlist">
    <!-- 顶层精品歌单展示 -->
    <div
      v-if="topPlaylistOneInfo.name"
      class="top-playlist-hot"
      :style="{
        backgroundImage: `url(${topPlaylistOneInfo.coverImgUrl})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
    >
      <div class="top-playlist-hot-image">
        <el-image :src="topPlaylistOneInfo.coverImgUrl"></el-image>
      </div>
      <div class="top-playlist-hot-content">
        <h1>{{ topPlaylistOneInfo.name }}</h1>
        <h4>{{ topPlaylistOneInfo.copywriter }}</h4>
      </div>
    </div>
    <!-- 标签 -->
    <div class="top-playlist-tags-div">
      <div class="top-playlist-tags-div-btn">
        <el-popover placement="right" :width="400" trigger="click">
          <template #reference>
            <div class="top-playlist-tags-btn">{{ currentTag }}</div>
          </template>
          <div class="top-playlist-tags-content">
            <div
              class="top-playlist-tags-title-content-div"
              @click="tagChangeClickHandle('全部')"
            >
              全部歌单
            </div>
            <div v-for="(tag, key) in tagTitleObj" class="top-playlist-tags">
              <div class="top-playlist-tags-title">
                <span>{{ key }}</span>
              </div>
              <div class="top-playlist-tags-title-content">
                <div
                  v-for="tagVal in tag"
                  :key="tagVal.name"
                  :class="[
                    'top-playlist-tags-title-content-div',
                    currentTag === tagVal.name ? 'active' : '',
                  ]"
                  @click="tagChangeClickHandle(tagVal.name)"
                >
                  {{ tagVal.name }}
                </div>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="top-playlist-tags-div-tags">
        <div
          v-for="tag in tagsArr"
          :key="tag.name"
          :class="[
            'top-playlist-tags-div-tag',
            currentTag === tag.name ? 'active' : '',
          ]"
          @click="tagChangeClickHandle(tag.name)"
        >
          {{ tag.name }}
        </div>
      </div>
    </div>
    <!-- 歌单列表 -->
    <div class="top-playlist-songSheet-content">
      <song-sheet-com
        v-for="currentSongSheet in currentSongSheetInfo"
        :key="currentSongSheet.id"
        :songSheetData="currentSongSheet"
        @click="songSheetClickHandle(currentSongSheet.id)"
      ></song-sheet-com>
    </div>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="currentPage"
      background
      layout="prev, pager, next"
      :total="totalPage"
      :page-size="100"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
// 请求
import {
  getPlaylistHighquality,
  getPlaylistHot,
  getTopPlaylist,
  getPlaylistCatlist,
} from "@/api/SongSheet/index";
import { SongSheetCom } from "@/components";
import { defineComponent, onMounted, reactive, ref, getCurrentInstance } from "vue";

export default defineComponent({
  name: "SongSheet",
  components: {
    SongSheetCom,
  },
  /* data() {
    return {
      topPlaylistOneInfo: {}, // 精品歌单信息
      tagsArr: [], // 标签分类数组
      currentTag: "全部", // 当前标签
      playlistObjByCat: {}, // cat 分类歌单数组
      currentPage: 1, // 当前页
      totalPage: 0, // 一共多少页
      currentSongSheetInfo: [], // 当前歌单信息列表
      tagTitleObj: {},
    };
  }, */
  setup() {
    let topPlaylistOneInfo: any = ref({}); // 精品歌单信息
    const tagsArr = ref([]); // 标签分类数组
    const currentTag = ref("全部"); // 当前标签
    const playlistObjByCat: any = ref({}); // cat 分类歌单数组
    const currentPage = ref(1); // 当前页
    const totalPage = ref(0); // 一共多少页
    const currentSongSheetInfo: any = ref([]); // 当前歌单信息列表
    let tagTitleObj: any = reactive({});

    const instance: any = getCurrentInstance();
    const root = instance.ctx.$root;


    // mounted
    onMounted(() => {
      // let _this = this as any;

      // 获取 tag 全部的精品歌单（1个）
      getPlaylistHighquality().then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let { name, copywriter, coverImgUrl } = data.playlists[0];
          topPlaylistOneInfo.value= {
            name,
            copywriter,
            coverImgUrl,
          };
        }
      });
      // hot 获取标签分类
      getPlaylistHot().then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          tagsArr.value = data.tags;
        }
      });
      // 获取全部标签分类
      getPlaylistCatlist().then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let categories = Object.assign({}, data.categories);
          console.log("getPlaylistCatlist", data);
          for (let key in categories) {
            tagTitleObj[categories[key]] = [];
          }
          data.sub.forEach((cat: any) => {
            tagTitleObj[categories[cat.category]].push(cat);
          });
        }
      });
      const loading = root.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 获取全部分类中的歌单（100个）
      if (!playlistObjByCat.value["全部"]) {
        playlistObjByCat.value["全部"] = [];
        getTopPlaylist(1).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            let { cat, playlists, total } = data;
            totalPage.value = total;
            let newplaylistsArr = playlists.map(
              (playlist: any, index: number) => {
                let list = {
                  id: playlist.id,
                  name: playlist.name,
                  picUrl: playlist.coverImgUrl,
                  playCount: playlist.playCount,
                };
                playlistObjByCat.value[cat][index] = list;
                return list;
              }
            );
            currentSongSheetInfo.value = newplaylistsArr;
            loading.close();
          }
        });
      } else {
        currentSongSheetInfo.value = playlistObjByCat.value["全部"].filter(
          (playlist: any, index: number) => index < 100
        );
        loading.close();
      }
    });



    // methods
    // 标签修改点击事件
    const tagChangeClickHandle = (tagName: string) => {
      let loading = root.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      currentTag.value = tagName;
      currentPage.value = 1;
      if (!playlistObjByCat.value[tagName]) {
        playlistObjByCat.value[tagName] = [];
      }
      let page = currentPage.value;
      let cat = tagName;
      if (
        playlistObjByCat.value[cat] ||
        playlistObjByCat.value[cat][(page - 1) * 100] !== undefined
      ) {
        getTopPlaylist(page, cat).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            let { cat, playlists, total } = data;
            totalPage.value = total;
            let newplaylistsArr = playlists.map(
              (playlist: any, index: number) => {
                let list = {
                  id: playlist.id,
                  name: playlist.name,
                  picUrl: playlist.coverImgUrl,
                  playCount: playlist.playCount,
                };
                playlistObjByCat.value[cat][index] = list;
                return list;
              }
            );
            currentSongSheetInfo.value = newplaylistsArr;
            loading.close();
          }
        });
      } else {
        let currentPageNum = totalPage.value - (page - 1) * 100;
        currentSongSheetInfo.value = [];
        if (currentPageNum > 100) {
          for (let i = 0, l = 100; i < l; i++) {
            currentSongSheetInfo[i] =
              playlistObjByCat.value[cat][(page - 1) * 100 + i];
          }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            currentSongSheetInfo[ii] =
              playlistObjByCat.value[cat][(page - 1) * 100 + ii];
          }
        }
        loading.close();
      }
      // 请求获得对应 cat 精品歌单
      getPlaylistHighquality(tagName).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let { name, copywriter, coverImgUrl } = data.playlists[0];
          topPlaylistOneInfo.value = {
            name,
            copywriter,
            coverImgUrl,
          };
        }
      });
    };
    // 点击歌单事件
    const songSheetClickHandle = (id: number) => {
      root.$router.push(`/songlists/${id}`);
    };
    // 分页事件
    const handleSizeChange = (val: number) => {
      console.log(`每页 ${val} 条`);
    };

    const handleCurrentChange = (val: number) => {
      let loading = root.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let cat = currentTag.value;
      let tag = currentTag.value;
      let currentFirstIndex = (val - 1) * 100;
      if (!playlistObjByCat.value[cat]) {
        playlistObjByCat.value[cat] = [];
      }
      if (
        // !_this.playlistObjByCat[cat] ||
        !playlistObjByCat.value[cat][currentFirstIndex]
      ) {
        getTopPlaylist(val, tag).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            let { cat, playlists, total } = data;
            totalPage.value = total;
            let newplaylistsArr = playlists.map(
              (playlist: any, index: number) => {
                let list = {
                  id: playlist.id,
                  name: playlist.name,
                  picUrl: playlist.coverImgUrl,
                  playCount: playlist.playCount,
                };
                playlistObjByCat.value[cat][currentFirstIndex + index] = list;
                return list;
              }
            );
            currentSongSheetInfo.value = newplaylistsArr;
            loading.close();
          }
        });
      } else {
        let currentPageNum = totalPage.value - (val - 1) * 100;
        currentSongSheetInfo.value = [];
        if (currentPageNum > 100) {
          for (let i = 0, l = 100; i < l; i++) {
            currentSongSheetInfo.value[i] =
              playlistObjByCat.value[cat][(val - 1) * 100 + i];
          }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            currentSongSheetInfo.value[ii] =
              playlistObjByCat.value[cat][(val - 1) * 100 + ii];
          }
        }
        loading.close();
      }
    };


    return {
      topPlaylistOneInfo, // 精品歌单信息
      tagsArr, // 标签分类数组
      currentTag, // 当前标签
      playlistObjByCat, // cat 分类歌单数组
      currentPage, // 当前页
      totalPage, // 一共多少页
      currentSongSheetInfo, // 当前歌单信息列表
      tagTitleObj,
      // methods
      tagChangeClickHandle,
      songSheetClickHandle,
      handleSizeChange,
      handleCurrentChange,
      
    }
  },
/*   mounted() {
    let _this = this as any;

    // 获取 tag 全部的精品歌单（1个）
    getPlaylistHighquality().then((res) => {
      let data = (res as any).data;
      if (data.code === 200) {
        let { name, copywriter, coverImgUrl } = data.playlists[0];
        _this.topPlaylistOneInfo = {
          name,
          copywriter,
          coverImgUrl,
        };
      }
    });
    // hot 获取标签分类
    getPlaylistHot().then((res) => {
      let data = (res as any).data;
      if (data.code === 200) {
        _this.tagsArr = data.tags;
      }
    });
    // 获取全部标签分类
    getPlaylistCatlist().then((res) => {
      let data = (res as any).data;
      if (data.code === 200) {
        let categories = Object.assign({}, data.categories);
        console.log("getPlaylistCatlist", data);
        for (let key in categories) {
          _this.tagTitleObj[categories[key]] = [];
        }
        data.sub.forEach((cat: any) => {
          _this.tagTitleObj[categories[cat.category]].push(cat);
        });
      }
    });
    let loading = _this.$loading({
      target: document.getElementsByClassName(
        "top-playlist-songSheet-content"
      )[0],
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    // 获取全部分类中的歌单（100个）
    if (!_this.playlistObjByCat["全部"]) {
      _this.playlistObjByCat["全部"] = [];
      getTopPlaylist(1).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let { cat, playlists, total } = data;
          _this.totalPage = total;
          let newplaylistsArr = playlists.map(
            (playlist: any, index: number) => {
              let list = {
                id: playlist.id,
                name: playlist.name,
                picUrl: playlist.coverImgUrl,
                playCount: playlist.playCount,
              };
              _this.playlistObjByCat[cat][index] = list;
              return list;
            }
          );
          _this.currentSongSheetInfo = newplaylistsArr;
          loading.close();
        }
      });
    } else {
      _this.currentSongSheetInfo = _this.playlistObjByCat["全部"].filter(
        (playlist: any, index: number) => index < 100
      );
      loading.close();
    }
  }, */
  /* methods: {
    // 标签修改点击事件
    tagChangeClickHandle(tagName: string) {
      let _this = this as any;
      let loading = _this.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      _this.currentTag = tagName;
      _this.currentPage = 1;
      if (!_this.playlistObjByCat[tagName]) {
        _this.playlistObjByCat[tagName] = [];
      }
      let page = _this.currentPage;
      let cat = tagName;
      if (
        _this.playlistObjByCat[cat] ||
        _this.playlistObjByCat[cat][(page - 1) * 100] !== undefined
      ) {
        getTopPlaylist(page, cat).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            let { cat, playlists, total } = data;
            _this.totalPage = total;
            let newplaylistsArr = playlists.map(
              (playlist: any, index: number) => {
                let list = {
                  id: playlist.id,
                  name: playlist.name,
                  picUrl: playlist.coverImgUrl,
                  playCount: playlist.playCount,
                };
                _this.playlistObjByCat[cat][index] = list;
                return list;
              }
            );
            _this.currentSongSheetInfo = newplaylistsArr;
            loading.close();
          }
        });
      } else {
        let currentPageNum = _this.totalPage - (page - 1) * 100;
        _this.currentSongSheetInfo = [];
        if (currentPageNum > 100) {
          for (let i = 0, l = 100; i < l; i++) {
            _this.currentSongSheetInfo[i] =
              _this.playlistObjByCat[cat][(page - 1) * 100 + i];
          }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            _this.currentSongSheetInfo[ii] =
              _this.playlistObjByCat[cat][(page - 1) * 100 + ii];
          }
        }
        loading.close();
      }
      // 请求获得对应 cat 精品歌单
      getPlaylistHighquality(tagName).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let { name, copywriter, coverImgUrl } = data.playlists[0];
          _this.topPlaylistOneInfo = {
            name,
            copywriter,
            coverImgUrl,
          };
        }
      });
    },
    // 点击歌单事件
    songSheetClickHandle(id: number) {
      this.$router.push(`/songlists/${id}`);
    },
    // 分页事件
    handleSizeChange(val: number) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val: number) {
      let _this = this as any;
      let loading = _this.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let cat = _this.currentTag;
      let tag = _this.currentTag;
      let currentFirstIndex = (val - 1) * 100;
      if (!_this.playlistObjByCat[cat]) {
        _this.playlistObjByCat[cat] = [];
      }
      if (
        // !_this.playlistObjByCat[cat] ||
        !_this.playlistObjByCat[cat][currentFirstIndex]
      ) {
        getTopPlaylist(val, tag).then((res) => {
          let data = (res as any).data;
          if (data.code === 200) {
            let { cat, playlists, total } = data;
            _this.totalPage = total;
            let newplaylistsArr = playlists.map(
              (playlist: any, index: number) => {
                let list = {
                  id: playlist.id,
                  name: playlist.name,
                  picUrl: playlist.coverImgUrl,
                  playCount: playlist.playCount,
                };
                _this.playlistObjByCat[cat][currentFirstIndex + index] = list;
                return list;
              }
            );
            _this.currentSongSheetInfo = newplaylistsArr;
            loading.close();
          }
        });
      } else {
        let currentPageNum = _this.totalPage - (val - 1) * 100;
        _this.currentSongSheetInfo = [];
        if (currentPageNum > 100) {
          for (let i = 0, l = 100; i < l; i++) {
            _this.currentSongSheetInfo[i] =
              _this.playlistObjByCat[cat][(val - 1) * 100 + i];
          }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            _this.currentSongSheetInfo[ii] =
              _this.playlistObjByCat[cat][(val - 1) * 100 + ii];
          }
        }
        loading.close();
      }
    },
  }, */
});
</script>

<style lang="less" scoped>
.top-playlist {
  width: 100%;
  .top-playlist-hot {
    box-sizing: border-box;
    width: 100%;
    border-radius: 1rem;
    display: flex;
    padding: 1rem;
    .top-playlist-hot-image {
      margin-right: 1rem;
      .el-image {
        width: 10rem;
        height: 10rem;
        border-radius: 1rem;
      }
    }
    .top-playlist-hot-content {
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      h1 {
        font-size: 1.7rem;
      }
    }
  }
  // 标签
  .top-playlist-tags-div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 2rem 0;
    .top-playlist-tags-div-btn {
      .top-playlist-tags-btn {
        padding: 0.5rem 1.2rem;
        border-radius: 3rem;
        border: 1px solid #8a8a8a;
        color: #8a8a8a;
        cursor: pointer;
        &:hover {
          background-color: #ffaaaa;
          border-color: #ffaaaa;
          color: #ffffff;
        }
      }
    }

    .top-playlist-tags-div-tags {
      display: flex;
      align-content: center;
      .top-playlist-tags-div-tag {
        display: inline-block;
        padding: 0.5rem;
        margin: 0.3rem;
        font-size: 0.7rem;
        color: #8b8b8b;
        transition: all 0.5s;
        cursor: default;

        &:hover {
          color: #575757;
        }
      }
      .active {
        color: #ffffff;
        background-color: #f1a8a8;
        border-radius: 0.7rem;
      }
    }
  }
  // 歌单列表
  .top-playlist-songSheet-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

// all tag
.top-playlist-tags-content {
  padding: 1rem;
  .top-playlist-tags-title-content-div {
    padding: 0.5rem;
    margin: 0.3rem;
    font-size: 0.7rem;
    color: #8b8b8b;
    transition: all 0.5s;
    cursor: default;

    &:hover {
      color: #575757;
    }
  }
  .top-playlist-tags {
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
    .top-playlist-tags-title {
      display: inline-block;
      flex: 0.1;
      padding: 0.5rem 1rem;
    }
    .top-playlist-tags-title-content {
      display: flex;
      flex-wrap: wrap;
      flex: 0.9;
      .top-playlist-tags-title-content-div {
        padding: 0.5rem;
        margin: 0.3rem;
        font-size: 0.7rem;
        color: #8b8b8b;
        transition: all 0.5s;
        cursor: default;

        &:hover {
          color: #575757;
        }
      }
      .active {
        color: #ffffff;
        background-color: #f1a8a8;
        border-radius: 0.7rem;
      }
    }
  }
}
</style>