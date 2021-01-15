<!--
 * @Author: your name
 * @Date: 2021-01-13 21:11:43
 * @LastEditTime: 2021-01-16 00:20:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\SonglistsDetails\index.vue
-->

<template>
  <div class="songlists-details">SongListsDetails{{ $route.params.id }}</div>
</template>

<script lang="ts">
// 请求
import { getSongListsById } from "@/api/songlists";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SonglistsDetails",
  data() {
    return {
      id: "" as string, // 歌单 id
      coverImgUrl: "",
      createTime: "",
      description: "",
      name: "",
      playCount: 0,
      tags: [],
      trackCount: 0,
      trackIds: [],
      nickname: "",
    };
  },
  mounted() {
    let _this = this as any;
    // params id
    let id = _this.$route.params.id;
    _this.id = id;
    // 请求数据
    getSongListsById(id).then((res) => {
      let data = (res as any).data;
      if (data.code === 200) {
        let {
          coverImgUrl,
          createTime,
          description,
          name,
          playCount,
          tags,
          trackCount,
          trackIds,
          creator,
        } = data.playlist;
        _this.nickname = creator.nickname;
        _this.coverImgUrl = coverImgUrl;
        _this.createTime = createTime;
        _this.description = description;
        _this.name = name;
        _this.playCount = playCount;
        _this.tags = tags;
        _this.trackCount = trackCount;
        _this.trackIds = trackIds;
      }
    });
  },
});
</script>