<!--
 * @Author: your name
 * @Date: 2021-01-18 15:52:02
 * @LastEditTime: 2021-01-18 18:27:30
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
    <div class="top-playlist-tags-div">
      <div class="top-playlist-tags-div-btn">全部</div>
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
  </div>
</template>

<script lang="ts">
// 请求
import { getPlaylistHighquality, getPlaylistHot } from "@/api/SongSheet/index";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SongSheet",
  data() {
    return {
      topPlaylistOneInfo: {}, // 精品歌单信息
      tagsArr: [], // 标签分类数组
      currentTag: "全部", // 当前标签
    };
  },
  mounted() {
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
    // 获取标签分类
    getPlaylistHot().then((res) => {
      let data = (res as any).data;
      if (data.code === 200) {
        _this.tagsArr = data.tags;
      }
    });
  },
  methods: {
    // 标签修改点击事件
    tagChangeClickHandle(tagName: string) {
      console.log(tagName);
      let _this = this as any;
      _this.currentTag = tagName;
    },
  },
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
}
</style>