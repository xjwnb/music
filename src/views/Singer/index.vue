<!--
 * @Author: your name
 * @Date: 2021-01-20 18:43:59
 * @LastEditTime: 2021-01-25 12:28:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\Singer\index.vue
-->
<template>
  <div class="singer" v-scroll:[scrollEle]="load">
    <!-- 标签 -->
    <div class="singer-tags">
      <div class="singer-tags-languages">
        <div class="singer-tags-title">语种：</div>
        <div class="singer-tags-content">
          <div
            v-for="area in areaArr"
            :key="area.id"
            @click="checkTagHandle(area)"
            :class="[
              'singer-tags-content-tag',
              currentArea === area.value ? 'active' : '',
            ]"
          >
            {{ area.text }}
          </div>
        </div>
      </div>
      <div class="singer-tags-sort">
        <div class="singer-tags-title">分类：</div>
        <div class="singer-tags-content">
          <div
            v-for="type in typeArr"
            :key="type.id"
            @click="checkTagHandle(type)"
            :class="[
              'singer-tags-content-tag',
              currentType === type.value ? 'active' : '',
            ]"
          >
            {{ type.text }}
          </div>
        </div>
      </div>
      <div class="singer-tags-screen">
        <div class="singer-tags-title">筛选：</div>
        <div class="singer-tags-content">
          <div
            v-for="alph in alphabet"
            :key="alph.id"
            @click="checkTagHandle(alph)"
            :class="[
              'singer-tags-content-tag',
              currentAlpha === alph.value ? 'active' : '',
            ]"
          >
            {{ alph.text }}
          </div>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="singer-content">
      <singer-com
        v-for="artistsData in artistsDataArr"
        :key="artistsData.id"
        :singerData="artistsData"
        @click="clickSingerHandle(artistsData)"
      ></singer-com>
    </div>
  </div>
</template>

<script lang="ts">
// const
import { alphabet, typeArr, areaArr } from "@/const/public/singer/index";
// vue
import {
  defineComponent,
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
} from "vue";
// interface
import {
  singerArtistListInterface,
  singerArtistListUrlParamInterface,
  singerComShowInterface,
} from "@/interface/views/singer";
// 请求
import { getArtistList } from "@/api/singer";
// 组件
import { SingerCom } from "@/components";

export default defineComponent({
  name: "Singer",
  components: {
    SingerCom,
  },
  data() {
    return {
      alphabet: alphabet, // 字母表
      typeArr: typeArr, // 分类数组
      areaArr: areaArr, // 语种数组
      currentAlpha: "-1",
      currentType: "-1",
      currentArea: "-1",
      artistsDataArr: [] as Array<singerComShowInterface>, // 歌手数据数组
      loading: null, // 加载
      scrollEle: "main", // 滚动节点
      offset: 0,
      currentPage: 1, // 当前页数
    };
  },
  setup() {
    const alphabetInfo: any = ref(alphabet); // 字母表
    const typeArray = ref(typeArr); // 分类数组
    const areaArray = ref(areaArr); // 语种数组
    const currentAlpha = ref("-1");
    const currentType = ref("-1");
    const currentArea = ref("-1");
    const artistsDataArr: any = ref<singerComShowInterface[]>([]); // 歌手数据数组
    const loading: any = ref(null); // 加载
    const scrollEle = ref("main"); // 滚动节点
    const offset = ref(0);
    const currentPage = ref(1); // 当前页数

    const instance: any = getCurrentInstance();
    const root = instance.ctx.$root;

    // Mounted
    onMounted(() => {
      // 加载
      loading.value = root.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 请求 信息
      let payload: singerArtistListUrlParamInterface = {
        type: currentType.value,
        area: currentArea.value,
        initial: currentAlpha.value,
        page: currentPage.value,
      };
      // 发请求
      getArtistListData(payload);
    });

    // methods
    // 选中 tag 标签事件
    const checkTagHandle = (tagInfo: singerArtistListInterface) => {
      currentPage.value = 1;
      // 加载
      loading.value = root.$loading({
        target: document.getElementsByClassName(
          "top-playlist-songSheet-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 请求信息
      let currentValue: singerArtistListUrlParamInterface = {
        type: currentType.value,
        area: currentArea.value,
        initial: currentAlpha.value,
        page: currentPage.value,
      };
      let { type, value } = tagInfo;
      switch (type) {
        case "alphabet":
          currentAlpha.value = value;
          currentValue.initial = value;
          break;
        case "type":
          currentType.value = value;
          currentValue.type = value;
          break;
        case "area":
          currentArea.value = value;
          currentValue.area = value;
          break;
      }
      let payload: singerArtistListUrlParamInterface = {
        type: currentValue.type,
        area: currentValue.area,
        initial: currentValue.initial,
        page: currentValue.page,
      };
      // 发请求
      getArtistListData(payload);
    };

    // 发起请求
    const getArtistListData = (payload: singerArtistListUrlParamInterface) => {
      getArtistList(payload).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let artistsDataArr1: Array<singerComShowInterface> = data.artists.map(
            (artist: any) => {
              let artistData: singerComShowInterface = {
                id: artist.id,
                name: artist.name,
                picUrl: artist.picUrl,
              };
              return artistData;
            }
          );
          artistsDataArr.value = artistsDataArr1;
          loading.value.close();
        }
      });
    };

    // load
    const load = () => {
      currentPage.value++;
      let currentValue: singerArtistListUrlParamInterface = {
        type: currentType.value,
        area: currentArea.value,
        initial: currentAlpha.value,
        page: currentPage.value,
      };
      let payload: singerArtistListUrlParamInterface = {
        type: currentValue.type,
        area: currentValue.area,
        initial: currentValue.initial,
        page: currentValue.page,
      };
      getArtistList(payload).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let artistsDataArr1: Array<singerComShowInterface> = data.artists.map(
            (artist: any) => {
              let artistData: singerComShowInterface = {
                id: artist.id,
                name: artist.name,
                picUrl: artist.picUrl,
              };
              return artistData;
            }
          );
          let artists = [...artistsDataArr.value, ...artistsDataArr1];
          artistsDataArr.value = artists;
          loading.value.close();
        }
      });
    };

    // 点击歌手事件
    const clickSingerHandle = (data: any) => {
      root.$router.push(`/singerDetial/${data.id}`);
    };

    return {
      alphabetInfo, // 字母表
      typeArray, // 分类数组
      areaArray, // 语种数组
      currentAlpha,
      currentType,
      currentArea,
      artistsDataArr, // 歌手数据数组
      loading, // 加载
      scrollEle, // 滚动节点
      offset,
      currentPage,

      // methods
      checkTagHandle,
      getArtistListData,
      load,
      clickSingerHandle,
    };
  },
  // mounted() {
  //   let _this = this as any;
  //   // 加载
  //   _this.loading = _this.$loading({
  //     target: document.getElementsByClassName(
  //       "top-playlist-songSheet-content"
  //     )[0],
  //     lock: true,
  //     text: "Loading",
  //     spinner: "el-icon-loading",
  //     background: "rgba(0, 0, 0, 0.7)",
  //   });
  //   // 请求 信息
  //   let payload: singerArtistListUrlParamInterface = {
  //     type: _this.currentType,
  //     area: _this.currentArea,
  //     initial: _this.currentAlpha,
  //     page: _this.currentPage,
  //   };
  //   // 发请求
  //   _this.getArtistListData(payload);
  //   /* getArtistList(payload).then((res) => {
  //     console.log("getArtistList", res);
  //     let data = (res as any).data;
  //     if (data.code === 200) {
  //       let artistsDataArr: Array<singerComShowInterface> = data.artists.map(
  //         (artist: any) => {
  //           let artistData: singerComShowInterface = {
  //             id: artist.id,
  //             name: artist.name,
  //             picUrl: artist.picUrl,
  //           };
  //           return artistData;
  //         }
  //       );
  //       _this.artistsDataArr = artistsDataArr;
  //     }
  //   }); */
  // },
  // methods: {
  // // 选中 tag 标签事件
  // checkTagHandle(tagInfo: singerArtistListInterface) {
  //   let _this = this as any;
  //   _this.currentPage = 1;
  //   // 加载
  //   _this.loading = _this.$loading({
  //     target: document.getElementsByClassName(
  //       "top-playlist-songSheet-content"
  //     )[0],
  //     lock: true,
  //     text: "Loading",
  //     spinner: "el-icon-loading",
  //     background: "rgba(0, 0, 0, 0.7)",
  //   });
  //   // 请求信息
  //   let currentValue: singerArtistListUrlParamInterface = {
  //     type: _this.currentType,
  //     area: _this.currentArea,
  //     initial: _this.currentAlpha,
  //     page: _this.currentPage,
  //   };
  //   let { type, value } = tagInfo;
  //   switch (type) {
  //     case "alphabet":
  //       _this.currentAlpha = value;
  //       currentValue.initial = value;
  //       break;
  //     case "type":
  //       _this.currentType = value;
  //       currentValue.type = value;
  //       break;
  //     case "area":
  //       _this.currentArea = value;
  //       currentValue.area = value;
  //       break;
  //   }
  //   let payload: singerArtistListUrlParamInterface = {
  //     type: currentValue.type,
  //     area: currentValue.area,
  //     initial: currentValue.initial,
  //     page: currentValue.page,
  //   };
  //   // 发请求
  //   _this.getArtistListData(payload);
  //   /* getArtistList(payload).then((res) => {
  //     console.log("getArtistList", res);
  //     let data = (res as any).data;
  //     if (data.code === 200) {
  //       let artistsDataArr: Array<singerComShowInterface> = data.artists.map(
  //         (artist: any) => {
  //           let artistData: singerComShowInterface = {
  //             id: artist.id,
  //             name: artist.name,
  //             picUrl: artist.picUrl,
  //           };
  //           return artistData;
  //         }
  //       );
  //       _this.artistsDataArr = artistsDataArr;
  //     }
  //   }); */
  // },
  /* // 发起请求
    getArtistListData(payload: singerArtistListUrlParamInterface) {
      let _this = this as any;
      getArtistList(payload).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let artistsDataArr: Array<singerComShowInterface> = data.artists.map(
            (artist: any) => {
              let artistData: singerComShowInterface = {
                id: artist.id,
                name: artist.name,
                picUrl: artist.picUrl,
              };
              return artistData;
            }
          );
          _this.artistsDataArr = artistsDataArr;
          _this.loading.close();
        }
      });
    } ,*/
  /*  // load
    load() {
      let _this = this as any;
      _this.currentPage++;
      let currentValue: singerArtistListUrlParamInterface = {
        type: _this.currentType,
        area: _this.currentArea,
        initial: _this.currentAlpha,
        page: _this.currentPage,
      };
      let payload: singerArtistListUrlParamInterface = {
        type: currentValue.type,
        area: currentValue.area,
        initial: currentValue.initial,
        page: currentValue.page,
      };
      getArtistList(payload).then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          let artistsDataArr: Array<singerComShowInterface> = data.artists.map(
            (artist: any) => {
              let artistData: singerComShowInterface = {
                id: artist.id,
                name: artist.name,
                picUrl: artist.picUrl,
              };
              return artistData;
            }
          );
          let artists = [..._this.artistsDataArr, ...artistsDataArr];
          _this.artistsDataArr = artists;
          _this.loading.close();
        }
      });
    }, */
  /* // 点击歌手事件
    clickSingerHandle(data: any) {
      this.$router.push(`/singerDetial/${data.id}`);
    }, */
  // },
});
</script>

<style lang="less" scoped>
.singer {
  .singer-tags {
    .singer-tags-languages {
      display: flex;
    }
    .singer-tags-sort {
      display: flex;
    }
    .singer-tags-screen {
      display: flex;
      align-content: flex-start;
    }
    .singer-tags-title {
      // flex: ;
      padding: 1rem 0;
    }
    .singer-tags-content {
      display: flex;
      flex-wrap: wrap;
      flex: 1;

      .singer-tags-content-tag {
        padding: 0.5rem 1rem;
        margin: 0.5rem 0.7rem;
        color: #969696;
        cursor: pointer;
        border-radius: 2rem;
        &:hover {
          color: #707070;
        }
      }
      .active {
        color: #ffffff;
        background-color: #eb8c8c;
        &:hover {
          color: #ffffff;
        }
      }
    }
  }
  // 内容
  .singer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>