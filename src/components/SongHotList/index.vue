<!--
 * @Author: your name
 * @Date: 2021-01-26 21:12:34
 * @LastEditTime: 2021-01-27 01:30:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\components\SongHotList\index.vue
-->
<template>
  <div class="song-hot-list">
    <div
      class="song-hot-list-item"
      v-for="(songData, index) in data"
      :key="songData.id"
      @click.stop="clickHandle(songData)"
    >
      <div class="song-hot-list-item-index">
        <span :class="[index < 3 ? 'hot-font' : '']">{{ index + 1 }}</span>
      </div>
      <div class="song-hot-list-item-info">
        <div class="song-hot-list-item-info-top">
          <div class="song-hot-list-item-info-title">
            {{ songData.searchWord }}
          </div>
          <img v-if="songData.iconUrl" :src="songData.iconUrl" />
          <div class="song-hot-list-item-info-score">
            {{ songData.score }}
          </div>
          <!-- <div class="song-hot-list-item-info-icon"> -->

          <!-- </div> -->
        </div>
        <div class="song-hot-list-item-info-bottom">
          <div class="song-hot-list-item-info-bottom-content">
            {{ songData.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, getCurrentInstance } from "vue";

export default defineComponent({
  name: "SongHotList",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const clickHandle = (songData: any) => {
      emit("click", songData);
    }

    return {
      clickHandle,
    }
  }
});
</script>

<style lang="less" scoped>
.song-hot-list-item {
  display: flex;
  align-items: center;
  padding: 7px;
  cursor: pointer;
  &:hover {
    background-color: #f2f2f2;
  }
  .song-hot-list-item-index {
    padding: 15px;
    margin-right: 7px;
    box-sizing: border-box;
    font-size: 15px;
    .hot-font {
      color: #FF3A3A;
    }
  }
  .song-hot-list-item-info {
    width: 220px;
    .song-hot-list-item-info-top {
      display: flex;
      .song-hot-list-item-info-title {
        font-size: 14px;
        font-weight: 700;
        margin-right: 7px;

        // font-family:'Times New Roman', Times, serif;
      }
      img {
        width: auto;
        height: 14px;
        margin-right: 7px;
      }
      .song-hot-list-item-info-score {
        font-size: 12px;
        color: #d3c4c4;
      }
    }
    .song-hot-list-item-info-bottom {
      .song-hot-list-item-info-bottom-content {
        font-size: 12px;
        color: #979797;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
  }
}
</style>