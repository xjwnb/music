<template>
  <div class="carousel">
    <el-carousel :interval="4000" type="card" height="250px">
      <el-carousel-item v-for="carousel in carouselData" :key="carousel.imageUrl">
        <el-image lazy :src="carousel.imageUrl"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Carousel",
  props: {
    carouselData: {
      type: Object,
    },
  },
});
</script>

<style lang="less" scoped>
.carousel {
  /* .el-image {
    img {
      width: 500px;
      height: auto;
    }
  } */
}
</style>