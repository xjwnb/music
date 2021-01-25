<!--
 * @Author: your name
 * @Date: 2021-01-20 12:39:58
 * @LastEditTime: 2021-01-25 11:56:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\RankingList\index.vue
-->
<template>
  <div class="ranking-list">
    <div class="ranking-list-content">
      <song-sheet-com
        v-for="list in toplist"
        :songSheetData="list"
        @click="songSheetClickHandle(list.id)"
      >
      </song-sheet-com>
    </div>
  </div>
</template>

<script lang="ts">
// 请求
import { getToplist } from "@/api/RankingList";
import { defineComponent, onMounted, reactive, ref, getCurrentInstance } from "vue";
// 组件
import { SongSheetCom } from "@/components/index";

export default defineComponent({
  name: "RankingList",
  components: {
    SongSheetCom,
  },
  data() {
    return {
      toplist: [], // 排行榜数组
    };
  },
  setup() {
    let toplist =  ref([]);
    const instance: any = getCurrentInstance();
    const root = instance.ctx.$root;


    // mouthed
    onMounted(() => {
      getToplist().then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          console.log(data);
          toplist.value = data.list.map((list: any) => {
            return {
              id: list.id,
              name: list.name,
              picUrl: list.coverImgUrl,
              playCount: list.playCount,
            };
          });
        }
      });
    });

    // methods
    const songSheetClickHandle = (id: number) => {
      root.$router.push(`/songlists/${id}`);
    };

    return {
      toplist,
      // methods
      songSheetClickHandle,
    }
  },
 /*  mounted() {
    let _this = this as any;
    getToplist().then((res) => {
      console.log(res);
      let data = (res as any).data;
      if (data.code === 200) {
        console.log(data);
        _this.toplist = data.list.map((list: any) => {
          return {
            id: list.id,
            name: list.name,
            picUrl: list.coverImgUrl,
            playCount: list.playCount,
          };
        });
      }
    });
  }, */
  /* methods: {
    // 点击跳转到对应歌单
    songSheetClickHandle(id: number) {
      this.$router.push(`/songlists/${id}`);
    },
  }, */
});
</script>

<style lang="less" scoped>
.ranking-list {
  width: 100%;
  .ranking-list-content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
  }
}
</style>