<!--
 * @Author: your name
 * @Date: 2021-01-11 12:06:02
 * @LastEditTime: 2021-01-19 15:01:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\ClassifyShow\index.vue
-->

<template>
  <div class="classify-show">
    <div class="classify-title">
      <h3><slot name="title"></slot></h3>
    </div>
    <div class="classify-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ClassifyShow",
})
</script>

<style lang="less" scoped>
.classify-show {
  width: 100%;
  .classify-title {
    h3 {
      display: inline-block;
    }
  }
  .classify-content {
    width: 100%;
  }
}
</style>
