<!--
 * @Author: your name
 * @Date: 2021-01-12 17:28:06
 * @LastEditTime: 2021-01-12 18:02:46
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
        {{ latestMusicData.name }}
      </div>
      <div class="lastest-music-info-song-artists">
        {{ latestMusicData.artists.name }}
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
  width: 30%;
  height: 10rem;
  background-color: #33eec5;
  display: flex;
}
</style>