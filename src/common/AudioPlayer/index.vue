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
          <span>{{ nowTimeFormat }} / {{ totalTimeFormat }}</span>
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
    <div class="audio-player-right-edit">
      <div class="audio-player-right-edit-voice-control">
        <div
          @click="audioIsLoopChangeHandle"
          class="audio-player-right-edit-voice-control-isLoop"
        >
          <template v-if="isloop">
            <span class="iconfont icon-ziyuan"> </span>
          </template>
          <template v-else>
            <span class="iconfont icon-hanhan-01-01"> </span>
          </template>
        </div>
        <div
          @click="voiceChangeHandle"
          class="audio-player-right-edit-voice-control-hasVoice"
        >
          <template v-if="hasVoice">
            <span class="iconfont icon-shengyinkai"> </span>
          </template>
          <template v-else>
            <span class="iconfont icon-shengyinguan"> </span>
          </template>
        </div>
        <div class="audio-player-right-edit-voice-control-slider">
          <el-slider v-model="voiceVal" :disabled="!hasVoice"></el-slider>
        </div>
      </div>
    </div>
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
// number format utils
import { numberToTimeFormat } from "@/utils/numberFormat/index";

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
      hasVoice: true, // 是否有声音
      voiceVal: 60, // 音量大小
      isloop: false, // 是否循环播放
      totalTimeFormat: "", // 格式化后总时间
      nowTimeFormat: "", // 格式化后的当前时间
    };
  },
  watch: {
    // voiceVal 变化时间
    voiceVal(newVal) {
      let _this = this as any;
      let audio = _this.audio;

      if (audio) {
        audio.volume = newVal / 100;
      }
    },
    time(newVal) {
      let _this = (this as any);
      console.log(newVal);
      _this.nowTimeFormat = numberToTimeFormat(newVal);
    },
    /* totalTimeShowFormat(newVal) {
      let _this = (this as any);
      return numberToTimeFormat(newVal);
    } */
  },
  computed: {
    /*  totalTimeShowFormat() {
      let _this = (this as any);
      return numberToTimeFormat(_this.totalTime);
    } */
  },
  mounted() {
    store.commit("formatState");
    let _this = this as any;
    let audio = document.getElementsByTagName("audio")[0];
    // 设置是否循环
    // audio.setAttribute("loop", "loop");
    /* audio.addEventListener("playing", () => {
      console.log("playing");
    }) */
    // 设置初始化音量
    audio.volume = _this.voiceVal / 100;
    // 播放结束事件
    audio.addEventListener("ended", () => {
      _this.isplay = false;
      _this.time = 0;
      clearTimeout(_this.playTimeout);
      clearInterval(_this.timeInterval);
    });
    // 开始播放事件
    audio.addEventListener("canplay", () => {
      console.log("canplay");
      if (audio.loop) {
        _this.time = 0;
      }
      clearTimeout(_this.playTimeout);
      clearInterval(_this.timeInterval);
      _this.timeInterval = setInterval(() => {
        this.time++;
      }, 1000);
    });
    audio.addEventListener("loadstart", () => {
      console.log("loadstart");
    });
    _this.audio = audio;
    // audio.addEventListener("play", () => {});
    // 触发响应
    _this.$bus.on("audioPlay", () => {
      console.log(store.state);
      clearInterval(_this.timeInterval);
      clearTimeout(_this.playTimeout);
      let audio_id = store.getters[GET_AUDIO_ID];
      if (audio_id == _this.id) {
        clearInterval(_this.timeInterval);
        clearTimeout(_this.playTimeout);
        _this.audio.currentTime = 0;
        _this.audio.play();
        _this.time = 0;
        _this.playTimeout = setTimeout(() => {
          if (_this.audio.paused) {
            _this.audio.play();
            _this.isplay = true;
            _this.timeInterval = setInterval(() => {
              this.time++;
            }, 1000);
          }
        }, 50);
        return;
      }
      _this.id = (audio_id as number).toString();
      _this.audioInfo = store.state[AUDIO_INFO];
      _this.audio.pause();
      /* clearInterval(_this.timeInterval);
      clearTimeout(_this.playTimeout); */
      _this.time = 0;
      // 获取 audio 全部时间
      let audioTotalTime = (store.state[
        AUDIO_INFO
      ] as any).song.bMusic.playTime.toString();
      let nowAudioTotalTime = Number(
        audioTotalTime.replace(
          audioTotalTime.slice(-3, audioTotalTime.length),
          ""
        )
      );
      console.log(nowAudioTotalTime);
      _this.totalTime = nowAudioTotalTime;
      // 格式化总时间
      _this.totalTimeFormat = numberToTimeFormat(nowAudioTotalTime);
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
  beforeUnmount() {
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
            clearInterval(_this.timeInterval);
            _this.audio.play();
            _this.isplay = true;
            _this.timeInterval = setInterval(() => {
              this.time++;
            }, 1000);
          } else {
            clearInterval(_this.timeInterval);
            _this.audio.pause();
            this.isplay = false;
          }
        }
      }
    },
    // 是否禁音
    voiceChangeHandle() {
      let _this = this as any;
      if (_this.hasVoice) {
        _this.hasVoice = false;
        _this.audio.volume = 0;
      } else {
        _this.hasVoice = true;
        _this.audio.volume = _this.voiceVal / 100;
      }
    },
    // 是否单曲循环
    audioIsLoopChangeHandle() {
      let _this = this as any;
      _this.isloop = !_this.isloop;
      _this.audio.loop = !_this.audio.loop;
      /* if (_this.isloop) {
        _this.isloop = false;
        _this.audio.loop = false;
      } else {
        _this.isloop = true;
        _this.audio.loop = true;
      } */
    },
  },
});
</script>

<style lang="less" scoped>
.audio-player {
  position: relative;
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
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
  // 右边控制
  .audio-player-right-edit {
    display: flex;
    box-sizing: border-box;
    .audio-player-right-edit-voice-control {
      display: flex;
      width: 15rem;
      align-items: center;
      justify-content: center;

      .audio-player-right-edit-voice-control-isLoop {
        font-size: 1rem;
        margin-right: 0.7rem;
        font-weight: 700;
      }

      .audio-player-right-edit-voice-control-hasVoice {
        font-size: 1rem;
        margin-right: 0.7rem;
        font-weight: 700;
      }

      .audio-player-right-edit-voice-control-slider {
        .el-slider {
          width: 9rem;
        }
      }
    }
  }
}
.audio-player-right-edit-voice-control-slider {
  /deep/ .el-slider__bar {
    background-color: #dd3434 !important;
  }
  /deep/ .el-slider__button {
    width: 10px;
    height: 10px;
    background-color: #dd3434;
    border: 0;
  }
  /deep/ .el-slider__runway.disabled .el-slider__button {
    border-color: #c0c4cc;
  }
}
</style>