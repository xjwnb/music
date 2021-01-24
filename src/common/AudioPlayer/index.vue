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
      <div class="audio-player-left-info-image" @click="clickImageHandle">
        <el-image :src="audioInfo.picUrl"></el-image>
        <div class="audio-player-left-info-image-show">
          <div v-if="!isshowTop" class="audio-player-left-info-image-show-top">
            <span class="iconfont icon-xiangshang"></span>
          </div>
          <div v-else class="audio-player-left-info-image-show-bottom">
            <span class="iconfont icon-xiangxia"></span>
          </div>
        </div>
      </div>
      <div class="audio-player-left-info-msg">
        <div class="audio-player-left-info-msg-name">
          <span class="audio-player-left-info-msg-song-name">{{
            audioInfo.songName
          }}</span>
          <span class="audio-player-left-info-msg-song-artists-name">
            {{ audioInfo.artistName }}</span
          >
        </div>
        <div class="audio-player-left-info-msg-time">
          <span>{{ nowTimeFormat }} / {{ totalTimeFormat }}</span>
        </div>
      </div>
    </div>
    <div v-else class="audio-player-left-empty"></div>
    <div class="audio-player-center-control">
      <!-- <div class="audio-player-center-control-before">
        <span class="iconfont icon-houtui"></span>
      </div> -->
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
      <!-- <div class="audio-player-center-control-after">
        <span class="iconfont icon-qianjin"></span>
      </div> -->
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
            <span class="iconfont icon-shengyin"> </span>
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
    <!-- 展示歌词 -->
    <drawer-com
      :top="48"
      :bottom="83"
      direction="btt"
      :value="isshowTop"
      :width="'100%'"
    >
      <div v-if="id" class="drawer-content">
        <div class="drawer-content-left">
          <el-image :src="audioInfo.picUrl"></el-image>
        </div>
        <div class="drawer-content-right">
          <div class="drawer-content-right-lyric-content">
            <div
              v-for="(lyr, index) in lyric"
              :key="index"
              :class="[
                'drawer-content-right-lyric',
                lyr.playTime <= time && lyric[index + 1].playTime > time
                  ? 'drawer-lyr-active'
                  : '',
              ]"
            >
              {{ lyr.content }}
            </div>
          </div>
        </div>
      </div>
    </drawer-com>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import store from "@/store";
// getter
import { GET_AUDIO_ID } from "@/store/getter-types";
// state
import { AUDIO_INFO, AUDIO_LIST } from "@/store/state-types";
// number format utils
import { numberToTimeFormat } from "@/utils/numberFormat/index";
// 组件
import { DrawerCom } from "@/components";
// 请求
import { getSongLyric } from "@/api/audioInfo";

export default defineComponent({
  name: "AudioPlayer",
  components: {
    DrawerCom,
  },
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
      isshowTop: false, // 是否展示向上图片（el-image）
      imageControl: null,
      imageTimer: null,
      lyric: [], // 歌词数组
      // minutesSeconds: 0, // 毫秒
      // minutesSecondsTimer: null, // 毫秒计时器
      // nowTimeFormat === lyr.time ? 'drawer-lyr-active' : '',
    };
  },
  setup() {},
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
      let _this = this as any;
      let drawerActiveEle: any;
      let drawerActiveEleLength: number;
      let drawerLyrContentEle: any;
      let drawerContentRightEle: any;
      let drawerContentRightClientHeight: any;
      if (_this.isshowTop) {
        _this.$nextTick(() => {
          drawerActiveEle = document.getElementsByClassName(
            "drawer-lyr-active"
          );
          drawerContentRightEle = document.getElementsByClassName(
            "drawer-content-right"
          )[0];
          drawerContentRightClientHeight = drawerContentRightEle.clientHeight;
          drawerActiveEleLength = drawerActiveEle.length;
          drawerActiveEle = drawerActiveEle[drawerActiveEleLength - 1];
          let offsetTop = drawerActiveEle.offsetTop;
          drawerLyrContentEle = document.getElementsByClassName(
            "drawer-content-right-lyric-content"
          )[0];
          drawerLyrContentEle.style.transform = `translateY(-${
            offsetTop - drawerContentRightClientHeight / 2
          }px)`;
        });
      }
      _this.nowTimeFormat = numberToTimeFormat(newVal);
    },
    isplay(newVal) {
      let _this = this as any;
      _this.imageControl && _this.imageControl.stop();
      if (!newVal) {
        _this.imageControl && _this.imageControl.stop();
      } else {
        _this.imageControl && _this.imageControl.start();
      }
    },
    id(newVal) {
      let _this = this as any;
      let lyr: string = "";
      getSongLyric(newVal).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          lyr = data.lrc.lyric;
          let lyrArr = lyr.split(/\n/g);
          let newlyrArr: any = [];
          lyrArr.forEach((lyr: any, index: number) => {
            if (lyr.trim()) {
              // let time = lyr.match(/\[.\]/g)[0];
              // let content = lyr.replace(time, "");
              let minutes = Number(lyr.slice(1, 3));
              let seconds = Number(lyr.slice(4, 6));
              let contentStart = lyr.search(/\]/g) + 1;
              newlyrArr.push({
                time: minutes + " : " + minutes,
                content: lyr.slice(contentStart),
                playTime: minutes * 60 + seconds,
              });
            }
          });
          _this.lyric = newlyrArr;
        }
      });
    },
    /* totalTimeShowFormat(newVal) {
      let _this = (this as any);
      return numberToTimeFormat(newVal);
    } */
  },
  filters: {
    controlLyrActiveTimeClass(lyr: any, lyric: any[], index: number) {
      let _this = this as any;
      // nowTimeFormat === lyr.time  ? 'drawer-lyr-active' : ''
      if (_this.nowTimeFormat === lyr.time) {
        if (
          _this.nowTimeFormat.slice(1, 3) ===
            lyric[index + 1].time.slice(1, 3) &&
          Number(_this.nowTimeFormat.slice(-2)) <
            Number(lyric[index + 1].time.slice(-2))
        ) {
          return "drawer-lyr-active";
        } else {
          return "";
        }
      } else {
        return "";
      }
      // nowTimeFormat === lyr.time ? (nowTimeFormat.slice(1, 3) ===lyric[index + 1].time.slice(1, 3) &&Number(nowTimeFormat.slice(-2)) <Number(lyric[index + 1].time.slice(-2)) ? 'drawer-lyr-active' : '')  : ''
    },
  },
  mounted() {
    // store.commit("formatState");
    let _this = this as any;
    console.log(_this);
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
      _this.imageControl && _this.imageControl.stop();
      // 如果不是单曲循环，则播放下一首歌曲
      if (!_this.isloop) {
        let audio_list = store.state[AUDIO_LIST];
        let nowAudioIndex = audio_list.findIndex(
          (audio) => audio.id === _this.id
        );
        if (audio_list[nowAudioIndex + 2]) {
          // console.log(audio_list[nowAudioIndex + 2]);
          _this.id = audio_list[nowAudioIndex + 2].id;
          _this.audioInfo = audio_list[nowAudioIndex + 2];
          _this.audio.play();
          _this.isplay = true;
          _this.time = 0;
          _this.timeInterval = setInterval(() => {
            _this.time++;
          }, 1000);
        }
      }
    });
    // 数据请求异常失败
    audio.addEventListener("error", function () {
      _this.isplay = false;
      _this.audio.pause();
      clearTimeout(_this.playTimeout);
      clearInterval(_this.timeInterval);
    });

    // 开始播放事件
    /* audio.addEventListener("canplay", () => {
      console.log("canplay");
      if (audio.loop) {
        _this.time = 0;
      }
      clearTimeout(_this.playTimeout);
      clearInterval(_this.timeInterval);
      _this.timeInterval = setInterval(() => {
        this.time++;
      }, 1000);
    }); */
    // 数据请求完成
    audio.addEventListener("canplaythrough", () => {
      _this.audio.play();
      _this.imageControl && _this.imageControl.stop();
      _this.imageControl && _this.imageControl.start();
      // console.log("canplaythrough");
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
      console.log("store.state[AUDIO_LIST]", store.state[AUDIO_LIST]);
      clearInterval(_this.timeInterval);
      clearTimeout(_this.playTimeout);
      _this.imageControl && _this.imageControl.stop();
      let audio_id = store.getters[GET_AUDIO_ID];
      if (audio_id == _this.id) {
        clearInterval(_this.timeInterval);
        clearTimeout(_this.playTimeout);
        _this.audio.currentTime = 0;
        // _this.audio.play();
        _this.time = 0;
        _this.playTimeout = setTimeout(() => {
          if (_this.audio.paused) {
            // _this.audio.play();
            _this.isplay = true;
            _this.timeInterval = setInterval(() => {
              this.time++;
            }, 1000);
          }
        }, 50);
        return;
      }
      _this.id = (audio_id as number).toString();
      // _this.imageControl = _this.imageRotateControl();
      _this.audioInfo = store.state[AUDIO_INFO];
      _this.audio.pause();
      // _this.imageControl && _this.imageControl.stop();
      /* clearInterval(_this.timeInterval);
      clearTimeout(_this.playTimeout); */
      _this.time = 0;
      // 获取 audio 全部时间
      let audioTotalTime = (store.state[AUDIO_INFO] as any).playTime.toString();
      let nowAudioTotalTime = Number(
        audioTotalTime.replace(
          audioTotalTime.slice(-3, audioTotalTime.length),
          ""
        )
      );
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
    // console.log("store state AUDIO_INFO", store.state[AUDIO_INFO]);
  },
  beforeUnmount() {
    let _this = this as any;
    clearTimeout(_this.playTimeout);
    clearInterval(_this.timeInterval);
    _this.imageControl && _this.imageControl.stop();
  },
  methods: {
    // 播放 暂停
    audioPlay() {
      let _this = this as any;
      clearInterval(_this.timeInterval);
      _this.imageControl && _this.imageControl.stop();
      if (_this.id) {
        if (_this.audio) {
          if (_this.audio.paused) {
            clearInterval(_this.timeInterval);
            _this.audio.play();
            _this.imageControl && _this.imageControl.start();
            _this.isplay = true;
            _this.timeInterval = setInterval(() => {
              this.time++;
            }, 1000);
          } else {
            clearInterval(_this.timeInterval);
            _this.audio.pause();
            _this.imageControl && _this.imageControl.stop();
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
    // 点击歌曲头像图片
    clickImageHandle() {
      let _this = this as any;
      _this.isshowTop = !_this.isshowTop;
      _this.imageControl && _this.imageControl.stop();
      _this.imageControl = _this.imageRotateControl();
      _this.imageControl && _this.imageControl.start();
    },
    // 歌曲碟片旋转控制
    imageRotateControl() {
      let _this = this as any;
      const element: any = document.getElementsByClassName(
        "drawer-content-left"
      )[0];
      const imageEle = element.getElementsByClassName("el-image")[0];
      // let timer: any = null;
      let start = () => {
        _this.imageTimer = window.setInterval(
          _this.rotate.bind(this, imageEle),
          100
        );
      };
      let stop = () => {
        window.clearInterval(_this.imageTimer);
      };
      return {
        start: start,
        stop: stop,
      };
    },
    // 旋转函数
    rotate(imageEle: any) {
      let _this = this as any;
      if (_this.isplay) {
        let reg = /[0-9]+/g;
        let rotate = imageEle.style.transform || "rotate(0deg)";
        let rotateNum = rotate.match(reg)[0];
        rotateNum === "360" ? (rotateNum = "0") : null;
        imageEle.style.transform = `rotate(${Number(rotateNum) + 1}deg)`;
      }
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
      position: relative;
      &:hover .audio-player-left-info-image-show {
        display: block;
      }
      .el-image {
        width: 3rem;
        height: 3rem;
        border-radius: 0.2rem;
        // margin-right: 1rem;
        cursor: pointer;
      }
      .audio-player-left-info-image-show {
        display: none;
        cursor: pointer;
        // position: absolute;
        .audio-player-left-info-image-show-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 0.2rem;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 1.7rem;
            color: #ffffff;
          }
        }
        .audio-player-left-info-image-show-bottom {
          position: absolute;
          top: 0;
          left: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 0.2rem;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 1.7rem;
            color: #ffffff;
          }
        }
      }
    }
    .audio-player-left-info-msg {
      margin-left: 1rem;
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

// 抽屉样式
.drawer-content {
  display: flex;
  padding: 3rem;
  justify-content: center;
  align-items: center;
  .drawer-content-left {
    margin: 0 3rem;
    .el-image {
      width: 25rem;
      height: 25rem;
      border-radius: 50%;
    }
  }
  .drawer-content-right {
    min-width: 20rem;
    height: 30rem;
    padding: 1rem;
    overflow: hidden;
    .drawer-content-right-lyric-content {
      transition: all .5s;
      .drawer-content-right-lyric {
        margin: 1rem auto;
      }
    }
  }
}

// 歌词活动样式
.drawer-lyr-active {
  font-size: 1.2rem;
  color: turquoise;
}
</style>