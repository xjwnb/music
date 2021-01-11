
<template>
  <div class="song-sheet-com">
    <div class="song-sheet-img-div">
      <el-image :src="songSheetData.picUrl"></el-image>
    </div>
    <div class="song-sheet-name">
      <h4>{{ songSheetData.name }}</h4>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SongSheet",
  props: {
    songSheetData: Object,
  },
});
</script>

<style lang="less" scoped>
.song-sheet-com {
  display: inline-block;
  width: 18%;
  .song-sheet-img-div {
    display: inline-block;
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: .7rem;
    }
  }
  .song-sheet-name {
    h4 {
      padding: 0;
      margin: 0;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>