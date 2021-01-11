<!--
 * @Author: your name
 * @Date: 2021-01-11 12:19:56
 * @LastEditTime: 2021-01-11 16:28:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\SongSheet\index.vue
-->

<template>
  <div class="song-sheet-com">
    <div class="song-sheet-img-div">
      <el-image :src="songSheetData.picUrl"></el-image>
      <!-- 播放器 iconfont -->
      <div class="song-sheet-player-icon">
        <span class="iconfont icon-icon_play"></span>
      </div>
      <!-- 播放次数 -->
      <div class="song-sheet-player-count">
        <span class="iconfont icon-icon_play"></span>
        <span>{{ playCount }}</span>
      </div>
    </div>
    <div class="song-sheet-name">
      <h4>{{ songSheetData.name }}</h4>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
// utils
import { numberFormatUtil } from "@/utils";

export default defineComponent({
  name: "SongSheet",
  props: {
    songSheetData: Object,
  },
  setup(props) {
    // 格式化播放次数
    let { songSheetData } = props;
    let playCount = numberFormatUtil((songSheetData as any).playCount)
    
    return {
      playCount
    }
  },
});
</script>

<style lang="less" scoped>
.song-sheet-com {
  font-size: 12px;
  display: inline-block;
  width: 18%;
  cursor: pointer;
  .song-sheet-img-div {
    position: relative;
    display: inline-block;
    &:hover .song-sheet-player-icon {
      display: block;
    }

    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 0.7rem;
    }
    .song-sheet-player-icon {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      display: inline-block;
      padding: 0.3rem;
      background-color: rgba(206, 205, 205, 0.7);
      border-radius: 2rem;
      display: none;
      transition: display 2s;
      span {
        color: #e03636;
      }
    }
    .song-sheet-player-count {
      position: absolute;
      top: 1rem;
      right: 1rem;
      span {
        font-size: 16px;
        color: #ffffff;
      }
      .iconfont {
        margin-right: .2em;
      }
    }
  }
  .song-sheet-name {
    h4 {
      height: 3em;
      padding: 0;
      margin: 0;
      font-size: 1em;
      font-weight: 500;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>