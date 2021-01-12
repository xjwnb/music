<!--
 * @Author: your name
 * @Date: 2021-01-12 17:28:06
 * @LastEditTime: 2021-01-12 18:52:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\LatestMusic\index.vue
-->
<template>
  <div class="lastest-music">
    <div class="lastest-music-img">
      <el-image :src="latestMusicData.picUrl"></el-image>
    </div>
    <div class="lastest-music-info">
      <div class="lastest-music-info-song-name">
        <span>{{ latestMusicData.name }}</span>
      </div>
      <div class="lastest-music-info-song-artists">
        <span>{{ latestMusicData.song.artists[0].name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LatestMusic",
  props: {
    latestMusicData: {}    // 最新音乐数据
  }
})
</script>

<style lang="less" scoped>
.lastest-music {
  width: 33%;
  height: 8rem;
  display: flex;
  align-items: center;
  padding: 0 .5rem;
  box-sizing: border-box;
  border-top: 1px solid #eeeeee;
  transition: all 1s;

  &:hover {
    background-color: #eeeeee;
  }
  // display: inline-block;
  .lastest-music-img {
    margin-right: 1rem;
    cursor: pointer;
    .el-image {
      width: 6rem;
      height: 6rem;
      border-radius: .3rem;
    }
  }
  .lastest-music-info {
    .lastest-music-info-song-artists {
      span {
        color: #c7c7c7;
        font-size: .8rem;
        transition: color 1s;

        &:hover {
          color: #a8a8a8;
        }
      }
    }
    span {
      cursor: pointer;
    }
  }
}
.lastest-music:nth-child(4n) {
  border-bottom: 1px solid #eeeeee;
}
</style>