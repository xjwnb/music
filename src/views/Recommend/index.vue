<template>
  <div class="recommend-page">
    <!-- banner -->
    <div class="recommend-banner">
      <carousel-com :carouselData="bannersData" />
    </div>
    <!-- 推荐歌单 -->
    <div class="recommend-song-sheet">
      <classify-show-com>
        <template v-slot:title> 推荐歌单 </template>
        <template v-slot:content>
          <div class="recommend-song-content">
            <song-sheet-com
              v-for="songSheetData in personalizedSongData"
              :songSheetData="songSheetData" @click="songSheetClickHandle"
            ></song-sheet-com>
          </div>
        </template>
      </classify-show-com>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
// 请求
import { getRecommendBanner, getPersonalizedSong } from "@/api/recommend/index";
// 组件
import { CarouselCom, ClassifyShowCom, SongSheetCom } from "@/components/index";

export default defineComponent({
  name: "Recommend",
  components: {
    CarouselCom,
    ClassifyShowCom,
    SongSheetCom,
  },
  data() {
    return {
      bannersData: [], // banner 数据
      personalizedSongData: [], // 推荐歌单数据
    };
  },
  mounted() {
    // 获取 banner
    getRecommendBanner()
      .then((res) => {
        let data = (<any>res).data;
        if (data.code === 200) {
          this.bannersData = data.banners;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // 获取推荐歌单
    getPersonalizedSong()
      .then((res) => {
        console.log((res as any).data);
        let data = (res as any).data;
        if (data.code === 200) {
          this.personalizedSongData = data.result;
        } else {
          console.log("getPersonalizedSong 推荐歌单", data.code);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    songSheetClickHandle() {
      
    }
  }
});
</script>


<style lang="less" scoped>
.recommend-page {
  /* margin: 0 auto;
  width: 1260px; */
  .recommend-banner {
    margin-bottom: 1.5rem;
  }
  .recommend-song-sheet {
    .recommend-song-content {
      height: 34rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
    }
  }
}
</style>