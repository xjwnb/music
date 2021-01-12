<template>
  <div class="audio-player">
    <!-- audio -->
    <audio
      :src="id ? `https://music.163.com/song/media/outer/url?id=${id}.mp3` : ''"
    ></audio>
    <!-- 左侧歌曲信息 -->
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
      <!-- 播放暂停 -->
      <div class="audio-player-center-control-play" @click="audioPlay">
        <template v-if="!isplay">
          <div class="audio-player-center-control-play-isPlay">
            <span class="iconfont icon-icon_play"></span>
          </div>
        </template>

        <template v-else>
          <div class="audio-player-center-control-play-isPause">
            <span class="iconfont icon-zanting"></span>
          </div>
        </template>
      </div>
      <div class="audio-player-center-control-after">
        <span class="iconfont icon-qianjin"></span>
      </div>
    </div>
    <!-- 右侧控制 -->
    <div class="audio-player-right-edit">EDIT</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import store from "@/store";
// getter
import { GET_AUDIO_ID } from "@/store/getter-types";

export default defineComponent({
  name: "AudioPlayer",
  data() {
    return {
      isplay: false, // 播放状态
      id: "167937", // 音乐 id
      audio: null,
    };
  },
  mounted() {
    store.commit("formatState");
    let audio = document.getElementsByTagName("audio")[0];
    (this as any).audio = audio;
    console.dir(audio);
    audio.addEventListener("play", () => {});
    // 触发响应
    (this as any).$bus.on("audioPlay", () => {
      let audio_id = store.getters[GET_AUDIO_ID];
      this.id = (audio_id as number).toString();
      this.isplay = true;
      console.log(audio_id);
      console.log("audioPlay");
    });
    console.log(store);
  },
  methods: {
    // 播放 暂停
    audioPlay() {
      if (this.audio) {
        if ((this as any).audio.paused) {
          (this as any).audio.play();
          this.isplay = true;
        } else {
          (this as any).audio.pause();
          this.isplay = false;
        }
      }
    },
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