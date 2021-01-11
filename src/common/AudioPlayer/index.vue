<template>
  <div class="audio-player">
    <div v-if="id" class="audio-player-left-info">
      <div class="audio-player-left-info-image">
        <el-image></el-image>
      </div>
      <div class="audio-player-left-info-msg">
        <span class="audio-player-left-info-msg-name"></span>
      </div>
    </div>
    <div class="audio-player-left-empty"></div>
    <div class="audio-player-center-control">
      <div class="audio-player-center-control-before">
        <span class="iconfont icon-houtui"></span>
      </div>
      <div class="audio-player-center-control-play">
        <span v-if="!isplay" class="iconfont icon-icon_play"></span>
        <span v-else class="iconfont icon-zanting"></span>
      </div>
      <div class="audio-player-center-control-after">
        <span class="iconfont icon-qianjin"></span>
      </div>
    </div>
    <div class="audio-player-right-edit">EDIT</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "AudioPlayer",
  data() {
    return {
      isplay: false,  // 播放状态
      id: "",         // 音乐 id
    };
  },
});
</script>

<style lang="less" scoped>
.audio-player {
  width: 100%;
  height: 5rem;
  padding: 1rem;
  display: flex;
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  min-width: 800px;

  .audio-player-left-info {
    .audio-player-left-info-image {
      .el-image {
        width: 3rem;
        height: 3rem;
        border-radius: 0.2rem;
      }
    }
  }

  .audio-player-left-empty {
    width: 2rem;
    height: 1rem;
  }

  .audio-player-center-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #dd3434;
    span {
      font-weight: 800;
    }

    .audio-player-center-control-play {
      padding: 1rem;
      border-radius: 50%;
      background-color: #dd3434;
      margin: 0 2rem;
      cursor: pointer;
      span {
        color: #ffffff;
      }
    }
    .audio-player-center-control-before {
      cursor: pointer;
    }
    .audio-player-center-control-after {
      cursor: pointer;
    }
  }
}
</style>