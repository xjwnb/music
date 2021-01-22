<!--
 * @Author: your name
 * @Date: 2021-01-22 16:46:47
 * @LastEditTime: 2021-01-22 17:26:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\AlbumDetail\index.vue
-->

<template>
  <div class="album-detail">
    <h2>{{ title }}</h2>
    <el-table :data="data" stripe style="width: 100%">
      <el-table-column prop="index"> </el-table-column>
      <el-table-column prop="name"> </el-table-column>
      <el-table-column prop="time"> </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AlbumDetail",
  props: {
    title: String,
    data: Array,
  },
});
</script>

<style lang="less" scoped>
.album-detail {
  .el-table--fit {
    /deep/ .el-table__header-wrapper {
      display: none;
    }
  }
}
</style>