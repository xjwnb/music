<!--
 * @Author: your name
 * @Date: 2021-01-21 10:22:08
 * @LastEditTime: 2021-01-21 11:07:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\Singer\index.vue
-->
<template>
  <div class="singer-com">
    <div class="singer-com-image">
      <el-image :src="singerData.picUrl"></el-image>
    </div>
    <div class="singer-com-name">
      {{ singerData.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SingerCom",
  props: {
    singerData: {}, // 歌手信息
  }
});
</script>

<style lang="less" scoped>
.singer-com {
  width: 15%;
  cursor: pointer;
  .singer-com-image {
    .el-image {
      width: 100%;
      height: 12rem;
      border-radius: 1rem;
    }
  }
  .singer-com-name {
    height: 2.5rem;
  }
}
</style>