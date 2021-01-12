<template>
  <div class="audio-player">
    <!-- 进度条 -->
    <div class="audio-player-progress">
      <div
        class="audio-player-progress-inner"
        :style="{ width: id ? `${(time / totalTime) * 100}%` : '0%' }"
      ></div>
    </div>
    <!-- audio -->
    <audio
      :src="id ? `https://music.163.com/song/media/outer/url?id=${id}.mp3` : ''"
    ></audio>
    <!-- 左侧歌曲信息 -->
    <div v-if="id" class="audio-player-left-info">
      <div class="audio-player-left-info-image">
        <el-image :src="audioInfo.picUrl"></el-image>
      </div>
      <div class="audio-player-left-info-msg">
        <div class="audio-player-left-info-msg-name">
          <span class="audio-player-left-info-msg-song-name">{{
            audioInfo.name
          }}</span>
          <span class="audio-player-left-info-msg-song-artists-name">
            {{ audioInfo.song.artists[0].name }}</span
          >
        </div>
        <div class="audio-player-left-info-msg-time">
          <span>{{ time }} / {{ totalTime }}</span>
        </div>
      </div>
    </div>
    <div v-else class="audio-player-left-empty"></div>
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
// state
import { AUDIO_INFO } from "@/store/state-types";

export default defineComponent({
  name: "AudioPlayer",
  data() {
    return {
      isplay: false, // 播放状态
      id: "", // 音乐 id      167937
      audio: null,
      audioInfo: null, // 当前播放歌曲信息
      pausedTimeout: null,
      playTimeout: null,
      timeInterval: null,
      time: 0,
      totalTime: 0,
    };
  },
  mounted() {
    store.commit("formatState");
    let _this = this as any;
    let audio = document.getElementsByTagName("audio")[0];
    audio.addEventListener("ended", () => {
      _this.isplay = false;
      _this.time = 0;
      clearInterval(_this.timeInterval);
    });
    audio.addEventListener("loadedmetadata", () => {
      console.log("loadedmetadata");
      clearInterval(_this.timeInterval);
      _this.timeInterval = setInterval(() => {
        this.time++;
      }, 1000);
    });
    audio.addEventListener("loadstart", () => {
      console.log("loadstart");
    })
    _this.audio = audio;
    // audio.addEventListener("play", () => {});
    // 触发响应
    _this.$bus.on("audioPlay", () => {
      console.log(store.state);
      let audio_id = store.getters[GET_AUDIO_ID];
      _this.id = (audio_id as number).toString();
      _this.audioInfo = store.state[AUDIO_INFO];
      _this.audio.pause();
      clearInterval(_this.timeInterval);
      clearTimeout(_this.playTimeout);
      _this.time = 0;
      // 获取 audio 全部时间
      let audioTotalTime = (store.state[
        AUDIO_INFO
      ] as any).song.bMusic.playTime.toString();
      _this.totalTime = Number(
        audioTotalTime.replace(
          audioTotalTime.slice(-3, audioTotalTime.length),
          ""
        )
      );
      // this.isplay = true;
      // (this as any).audio.addEventListener("onloadedmetadata", () => {
      _this.playTimeout = setTimeout(() => {
        if (_this.audio.paused) {
          _this.audio.play();
          _this.isplay = true;
          _this.timeInterval = setInterval(() => {
            this.time++;
          }, 1000);
        }
      }, 50);
      // });
    });
    console.log(store);
  },
  beforeDestroy() {
    let _this = this as any;
    clearTimeout(_this.playTimeout);
    clearInterval(_this.timeInterval);
  },
  methods: {
    // 播放 暂停
    audioPlay() {
      let _this = this as any;
      clearInterval(_this.timeInterval);
      if (_this.id) {
        if (_this.audio) {
          if (_this.audio.paused) {
              _this.audio.play();
              _this.isplay = true;
              _this.timeInterval = setInterval(() => {
                this.time++;
              }, 1000);
          } else {
            _this.audio.pause();
            this.isplay = false;
            clearInterval(_this.timeInterval);
          }
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
  position: relative;
  // 进度条
  .audio-player-progress {
    box-sizing: border-box;
    position: absolute;
    max-width: 100%;
    height: 3px;
    z-index: 3;
    top: -4px;
    left: 0;
    right: 0;
    .audio-player-progress-inner {
      height: 100%;
      background-color: saddlebrown;
    }
  }

  .audio-player-left-info {
    display: flex;
    justify-content: center;
    align-items: center;
    .audio-player-left-info-image {
      .el-image {
        width: 3rem;
        height: 3rem;
        border-radius: 0.2rem;
        margin-right: 1rem;
      }
    }
    .audio-player-left-info-msg {
      .audio-player-left-info-msg-name {
        .audio-player-left-info-msg-song-name {
          font-size: 1rem;
        }
        .audio-player-left-info-msg-song-artists-name {
          font-size: 0.7rem;
          color: #c7c7c7;
          transition: color 1s;

          &:hover {
            color: #afafaf;
          }
        }
        span {
          cursor: pointer;
        }
      }
      .audio-player-left-info-msg-time {
        font-size: 0.7rem;
        color: #c7c7c7;
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