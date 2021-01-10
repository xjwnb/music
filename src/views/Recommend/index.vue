<template>
  <div class="recommend-page">
    <carousel-com :carouselData="bannersData" />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
// 请求
import { getRecommendBanner } from "@/api/recommend/index";
// 组件
import { CarouselCom } from "@/components/index";

export default defineComponent({
  name: "Recommend",
  components: {
    CarouselCom,
  },
  data() {
    return {
      bannersData: [],
    };
  },
  mounted() {
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
  },
});
</script>


<style lang="less" scoped>
.recommend-page {
  margin: 0 auto;
  width: 1260px;
}
</style>