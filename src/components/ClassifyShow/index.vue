
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
  .classify-content {
    width: 100%;
  }
}
</style>
