
<template>
  <div class="main-layout">
    <el-container>
      <el-header>
        <div class="header-left">
          <div class="header-logo">LOGO</div>
          <div class="header-history-control">
            <div class="header-history-left" @click="historyGo('left')">
              <span class="iconfont icon-zuojiantou"></span>
            </div>
            <div class="header-history-right" @click="historyGo('right')">
              <span class="iconfont icon-youjiantou"></span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <!-- 导航 -->
          <div class="header-right-nav-children" v-if="navChildren">
            <el-menu
              :default-active="navChildrenDefaultActive"
              class="el-menu-demo"
              mode="horizontal"
              router
              @select="asideNavHandleSelect"
            >
              <el-menu-item
                v-for="nav in navChildren"
                :key="nav.path"
                :route="nav.path"
                :index="nav.path"
                ><span>{{ nav.text }}</span></el-menu-item
              >
            </el-menu>
          </div>
          <!-- 用户 -->
          <div class="header-right-user-div">
            <div
              v-if="!isLogin"
              @click="loginHandle"
              class="header-right-user-login"
            >
              登录
            </div>
            <div v-else class="header-right-user-info">
              <el-popover placement="bottom" :width="100" trigger="click">
                <template #reference>
                  <div class="header-right-user-info-content">
                    <el-avatar :src="userInfo.profile.avatarUrl">{{
                      userInfo.profile.nickname
                    }}</el-avatar>
                    <span>{{ userInfo.profile.nickname }}</span>
                  </div>
                </template>
                <div
                  @click="logoutHandle"
                  class="header-right-user-info-logout"
                >
                  退出登录
                </div>
              </el-popover>
            </div>
            <!-- 搜索 -->
            <search-com
              v-model:text="searchInput"
              @input="debounceSearchHandle"
              @enter="searchEnterHandle"
            >
              <!-- 热门搜索 -->
              <div class="search-song-hot" v-show="!searchInput">
                <song-hot-list-com
                  :data="hotSongsList"
                  @click="clickHotSongHandle"
                ></song-hot-list-com>
              </div>
              <div class="search-song-search-result" v-show="searchInput">
                <div
                  v-for="(result, index) in searchResult"
                  class="search-song-search-result-div"
                >
                  <!-- 单曲 -->
                  <template v-if="index === 'songs'">
                    <div class="search-song-search-result-div-show">
                      <div class="search-song-search-result-title">单曲</div>
                      <div class="search-song-search-result-content">
                        <div
                          v-for="song in result"
                          class="search-song-search-result-item"
                          @click="searchSongClickHandle(song.id)"
                        >
                          <span class="search-song-search-result-item-name">{{
                            song.name
                          }}</span>
                          <span
                            class="search-song-search-result-item-artistname"
                          >
                            - {{ song.artists[0].name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 专辑 -->
                  <template v-else-if="index === 'albums'">
                    <div class="search-song-search-result-div-show">
                      <div class="search-song-search-result-title">专辑</div>
                      <div class="search-song-search-result-content">
                        <div
                          v-for="album in result"
                          class="search-song-search-result-item"
                          @click="searchAlbumsClickHandle(album.id)"
                        >
                          <span class="search-song-search-result-item-name">{{
                            album.name
                          }}</span>
                          <span
                            class="search-song-search-result-item-artistname"
                          >
                            - {{ album.artist.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 歌单 -->
                  <template v-else-if="index === 'playlists'">
                    <div class="search-song-search-result-div-show">
                      <div class="search-song-search-result-title">歌单</div>
                      <div class="search-song-search-result-content">
                        <div
                          v-for="playlists in result"
                          class="search-song-search-result-item"
                          @click="searchPlaylistsClickHandle(playlists.id)"
                        >
                          <span class="search-song-search-result-item-name">{{
                            playlists.name
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 歌手 -->
                  <template v-else>
                    <div class="search-song-search-result-div-show">
                      <div class="search-song-search-result-title">歌手</div>
                      <div class="search-song-search-result-content">
                        <div
                          v-for="songs in result"
                          class="search-song-search-result-item"
                          @click="searchSingerClickHandle(songs.id)"
                        >
                          <span class="search-song-search-result-item-name">{{
                            songs.name
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </search-com>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- 侧边 -->
        <el-aside>
          <el-menu
            :default-active="navDefaultActive"
            class="el-menu-vertical-demo"
            @select="asideNavHandleSelect"
            router
          >
            <el-menu-item
              v-for="aside_info in ASIDE_NAV_INFO"
              :key="aside_info.path"
              :index="aside_info.path"
              :route="aside_info.path"
            >
              <span>{{ aside_info.text }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主要内容 -->
        <el-main>
          <!-- <router-view>
            
          </router-view> -->
          <div class="main-content">
            <!-- <router-view></router-view> -->
            <router-view v-slot="{ Component }">
              <keep-alive
                :include="['Recommend', 'SongSheet', 'RankingList', 'Singer']"
              >
                <component :is="Component" />
              </keep-alive>
            </router-view>
            <!-- <keep-alive>
              <router-view v-if="$route.meta.keepAlive" ></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive || false" ></router-view> -->
          </div>
        </el-main>
      </el-container>
      <!-- 底部 footer -->
      <el-footer>
        <audio-player></audio-player>
      </el-footer>
    </el-container>
  </div>
</template>


<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  watch,
  computed,
  getCurrentInstance,
  onMounted,
} from "vue";
// vuex
import store from "@/store";
import { mapState } from "vuex";
import {
  LOGOUT_HANDLE,
  LOGIN_HANDLE,
  USER_INFO_SET,
} from "@/store/mutation-types";
import { ASIDE_NAV, IS_LOGIN, USER_INFO } from "@/store/state-types";
// 请求
import { getLoginStatus, logout } from "@/api/login";
// 搜索请求
import { search, searchHot } from "@/api/search";
// 歌曲信息请求
import { getSongDetailByIds } from "@/api/songlists";
// 播放器
import AudioPlayer from "@/common/AudioPlayer/index.vue";
import { ElMessage } from "element-plus";
// 组件
import { SearchCom, SongHotListCom } from "@/components";
// 页面
// import SonglistsDetails from "@/views/SonglistsDetails/index.vue";
import Recommend from "@/views/Recommend/index.vue";
import SongSheet from "@/views/SongSheet/index.vue";
import RankingList from "@/views/RankingList/index.vue";
import Singer from "@/views/Singer/index.vue";
// vuex
import {
  AUDIO_ID_CHANGE,
  AUDIO_LIST_ADD,
  AUDIO_INFO_CHANGE,
} from "@/store/mutation-types";
import { AUDIO_ID, AUDIO_INFO, AUDIO_LIST } from "@/store/state-types";
// interface
import { AudioInfoInterface } from "@/interface/public/audio";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "MainLayout",
  components: {
    AudioPlayer,
    SearchCom,
    SongHotListCom,
    Recommend,
    SongSheet,
    RankingList,
    Singer,
  },
  setup(props, { attrs, slots, emit }) {
    let isLogin = ref(false);
    let userInfo = ref({});
    const navChildren = ref(null);

    const ASIDE_NAV_INFO = ref((store as any).state[ASIDE_NAV]);
    // search value
    const searchInput = ref("");
    // 热门歌曲搜索列表
    let hotSongsList = ref([]);
    // 搜索结果
    let searchResult: any = reactive({});

    const instance: any = getCurrentInstance();
    const root = instance.proxy;
    console.log("instance", instance);
    const route = useRoute();
    const router = useRouter();

    // computed
    const navDefaultActive = computed(() => {
      // return formatPath(root.$route.path);
      return formatPath(route.path);
    });
    const navChildrenDefaultActive = computed(() => {
      return root.$route.path;
    });

    // watch
    watch(
      () => root.$route,
      (to: any, from: any) => {
        let toPath: string = to.path;
        // 正则判断 path
        let path = formatPath(toPath);
        let asideNav = filterAsideNavHandle(path);
        if (asideNav) {
          navChildren.value = asideNav.children;
        }
      }
    );

    // mounted
    onMounted(() => {
      let nowPath = root.$route.path;
      // 正则判断 path
      let path = formatPath(nowPath);
      let asideNav = filterAsideNavHandle(path);
      if (asideNav) {
        navChildren.value = asideNav.children;
      }
      // store

      // 判断登录
      getLoginStatus().then((res) => {
        let data = (res as any).data.data;
        console.log("getLoginStatus", data.code);
        if (data.code === 200) {
          console.log("getLoginStatus", data);
          if (!data.account && !data.profile) {
            store.commit(LOGOUT_HANDLE);

            // router.push("/login");
          } else {
            store.commit(LOGIN_HANDLE);
            store.commit(USER_INFO_SET, { account: data });
            // router.push("/");
            // 用户信息
            userInfo.value = store.state[USER_INFO];
            isLogin.value = store.state[IS_LOGIN];
          }
        }
      });
      // 获取最热搜索歌曲列表
      searchHot().then((res) => {
        console.log("searchHot", res);
        let data = (res as any).data;
        if (data.code === 200) {
          hotSongsList.value = data.data;
          console.log(hotSongsList);
        }
      });
    });

    // methods
    // header history go
    const historyGo = (direction: string) => {
      switch (direction) {
        case "left":
          root.$router.go(-1);
          break;
        case "right":
          root.$router.go(1);
          break;
      }
    };
    // 侧边导航
    const asideNavHandleSelect = (key: string, keyPath: object, data: any) => {
      // console.log(key, keyPath, data);
      root.$router.push(data.route);
    };
    // 设置 navChildren
    const filterAsideNavHandle = (path: string): any => {
      return ASIDE_NAV_INFO.value.find((nav: any) => nav.path === path);
    };
    const formatPath = (path: string): string => {
      let resultPath: string;
      let pathReg = /^\/[a-zA-z]+/;
      if (path.match(pathReg)) {
        return (path as any).match(pathReg)[0];
      }
      return "";
    };
    // 登录按钮
    const loginHandle = () => {
      root.$router.push("/login");
    };
    // 退出登录
    const logoutHandle = () => {
      logout().then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          ElMessage.success({
            message: "退出登录成功！",
            type: "success",
          });
          isLogin.value = false;
          console.log("logout  store.state", store.state);
        }
      });
    };
    // 输入框输入事件
    const searchInputHandle = (value: string | number) => {
      let filterEmptyVal = String(value).trim();
      if (filterEmptyVal) {
        search(filterEmptyVal).then((res) => {
          console.log(res);
          let data = (res as any).data;
          if (data.code === 200) {
            let result = data.result;
            let order = result.order && Object.assign([], result.order);
            console.log(order);
            order.forEach((ord: string) => {
              searchResult[ord] = Object.assign([], result[ord]);
            });
            console.log(searchResult);
          }
        });
      } else {
        return;
      }
    };

    // 输入框防抖事件
    const debounceSearch = function (fn: Function, wait: number) {
      let timer: any = null;
      return function () {
        let val = arguments[1];
        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn(val);
        }, wait);
      };
    };
    const debounceSearchHandle = debounceSearch(searchInputHandle, 1000).bind(
      null,
      arguments
    );

    const clickHotSongHandle = (data: any) => {
      console.log("clickHotSongHandle", data);
      root.$router.push({
        path: "search",
        query: { keyword: data.searchWord },
      });
    };

    // 点击歌手搜索结果
    const searchSingerClickHandle = (id: number) => {
      root.$router.push(`/singerDetial/${id}`);
    };
    // 点击歌单搜索结果
    const searchPlaylistsClickHandle = (id: number) => {
      root.$router.push(`/songlists/${id}`);
    };
    // 点击单曲搜索结果
    const searchSongClickHandle = (id: number) => {
      console.log(id);
      getSongDetailByIds(String(id)).then((res) => {
        console.log(res);
        let data = (res as any).data;
        if (data.code === 200) {
          let songs = data.songs[0];
          let { id, name, dt, ar, al } = songs;
          let audioData: AudioInfoInterface;
          audioData = {
            id,
            songName: name,
            artistName: ar[0].name,
            playTime: dt,
            picUrl: al.picUrl,
          };
          store.commit(AUDIO_ID_CHANGE, { id });
          store.commit(AUDIO_INFO_CHANGE, { audioInfo: audioData });
          store.commit(AUDIO_LIST_ADD, { audioData });
          root.$bus.emit("audioPlay");
        }
      });
    };

    // 搜索回车事件
    const searchEnterHandle = (val: any) => {
      root.$router.push({
        path: "search",
        query: { keyword: val },
      });
    };

    // 搜索专辑点击事件
    const searchAlbumsClickHandle = (id: number) => {
      root.$router.push(`/albumDetail/${id}`);
    };

    return {
      isLogin,
      userInfo,
      ASIDE_NAV_INFO,
      navChildren,
      searchInput,
      hotSongsList,
      searchResult,
      // computed
      navDefaultActive,
      navChildrenDefaultActive,
      // methods
      historyGo,
      asideNavHandleSelect,
      filterAsideNavHandle,
      formatPath,
      loginHandle,
      logoutHandle,
      searchInputHandle, // 搜索事件
      debounceSearchHandle,
      clickHotSongHandle, // 点击热门歌曲
      searchSingerClickHandle, // 点击搜索歌手
      searchPlaylistsClickHandle, // 点击歌单搜索结果
      searchSongClickHandle,
      searchEnterHandle, // 搜索回车事件
      searchAlbumsClickHandle, // 专辑搜索点击事件
    };
  },
  /* data() {
    return {
      navChildren: null, // 子导航内容
      isLogin: false, // 是否登录
      userInfo: {}, // 用户信息
    };
  }, */
  /* computed: {
    ...mapState([ASIDE_NAV]),
    navDefaultActive() {
      return (this as any).formatPath(this.$route.path);
    },
    navChildrenDefaultActive() {
      return this.$route.path;
    },
  }, */
  /* watch: {
    $route(to: any, from) {
      let toPath: string = to.path;
      // 正则判断 path
      let path = this.formatPath(toPath);
      let asideNav = this.filterAsideNavHandle(path);
      if (asideNav) {
        this.navChildren = asideNav.children;
      }
    },
  }, */
  /*  mounted() {
    let _this = this as any;
    let nowPath = this.$route.path;
    // 正则判断 path
    let path = this.formatPath(nowPath);
    let asideNav = this.filterAsideNavHandle(path);
    if (asideNav) {
      this.navChildren = asideNav.children;
    }
    // store

    // 判断登录
    getLoginStatus().then((res) => {
      let data = (res as any).data.data;
      console.log("getLoginStatus", data.code);
      if (data.code === 200) {
        console.log("getLoginStatus", data);
        if (!data.account && !data.profile) {
          store.commit(LOGOUT_HANDLE);
          console.log(store.state.IS_LOGIN);

          // router.push("/login");
        } else {
          store.commit(LOGIN_HANDLE);
          store.commit(USER_INFO_SET, { account: data });
          console.log(store.state.IS_LOGIN);
          // router.push("/");
          // 用户信息
          _this.userInfo = store.state[USER_INFO];
          _this.isLogin = store.state[IS_LOGIN];
        }
      }
    });
  }, */
  /* methods: {
    // header history go
    historyGo(direction: string) {
      let _this = this;
      switch (direction) {
        case "left":
          _this.$router.go(-1);
          break;
        case "right":
          _this.$router.go(1);
          break;
      }
    },
    // 侧边导航
    asideNavHandleSelect(key: string, keyPath: object, data: any) {
      // console.log(key, keyPath, data);
      this.$router.push(data.route);
    },
    // 设置 navChildren
    filterAsideNavHandle(path: string): any {
      return this[ASIDE_NAV].find((nav: any) => nav.path === path);
    },
    formatPath(path: string): string {
      let resultPath: string;
      let pathReg = /^\/[a-zA-z]+/;
      if (path.match(pathReg)) {
        return (path as any).match(pathReg)[0];
      }
      return "";
    },
    // 登录按钮
    loginHandle() {
      this.$router.push("/login");
    },
    // 退出登录
    logoutHandle() {
      logout().then((res) => {
        let data = (res as any).data;
        if (data.code === 200) {
          ElMessage.success({
            message: "退出登录成功！",
            type: "success",
          });
          this.isLogin = false;
          console.log("logout  store.state", store.state);
        }
      });
    },
  }, */
});
</script>

<style lang="less" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    position: relative;

    .el-header {
      // display: flex;
      background-color: #b3c0d1;
      color: #333;
      padding: 0;
      position: relative;
      height: 3rem !important;
      position: relative;
      top: 0;

      .header-left {
        display: flex;
        justify-content: space-between;
        width: 12rem;
        height: 100%;
        background-color: #fff;
        padding: 0 0.5rem;
        box-sizing: border-box;

        .header-logo {
          height: 100%;
          line-height: 3rem;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .header-history-control {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 1.2rem;
            font-weight: 700;
          }
          .header-history-left,
          .header-history-right {
            padding: 0.2rem;
            border-radius: 5rem;

            &:hover {
              background-color: #f0f0f0;
            }
          }
          .header-history-left {
            margin-right: 1rem;
          }
        }
      }
      .header-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 0;
        left: 12rem;
        right: 0;
        height: 100%;
        background-color: #fff;
        .header-right-nav-children {
          /deep/ .el-menu {
            height: 3rem !important;
            width: 430px !important;
            .el-menu-item {
              height: 3rem !important;
            }
          }
          /deep/ .el-menu.el-menu--horizontal {
            border-bottom: 0;
          }
        }
        .header-right-user-div {
          justify-self: self-end;
          display: flex;

          margin: 0 10px;
          .header-right-user-login {
            cursor: pointer;
            color: #8a8a8a;
            font-size: 0.7rem;
            width: 200px;
            &:hover {
              color: #535353;
            }
          }
          .header-right-user-info {
            .header-right-user-info-content {
              margin: 0 10px;
              min-width: 150px;
              // overflow: hidden;
              text-overflow: ellipsis;
              display: flex;
              justify-content: center;
              align-items: center;
              span {
                font-size: 0.8rem;
              }
              cursor: pointer;
              .el-avatar {
                width: 30px;
                height: 30px;
                margin-right: 0.5rem;
                border-radius: 50%;
                object-fit: cover;
              }
            }
            .header-right-user-info-logout {
              cursor: pointer;
              padding: 5px;
            }
          }
        }
      }
    }

    .el-aside {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      bottom: 5rem;
      background-color: #d3dce6;
      color: #333;
      width: 12rem !important;
      padding: 0;
      // line-height: 200px;
    }

    .el-main {
      position: absolute;
      top: 0;
      right: 0;
      left: 12rem;
      bottom: 5rem;
      // background-color: #e9eef3;
      color: #333;
      padding: 0;
      min-width: 1260px;

      // line-height: 160px;
      .main-content {
        margin: 1rem auto;
        width: 1260px;
      }
    }

    .el-footer {
      background-color: #b3c0d1;
      color: #333;
      height: 5rem !important;
      padding: 0;
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
    }
  }
}
.search-song-hot {
  width: 100%;
  height: 350px;
  overflow-y: scroll;
}
// 搜索结果
.search-song-search-result {
  .search-song-search-result-div {
    .search-song-search-result-div-show {
      .search-song-search-result-title {
        padding: 5px 10px;
        font-weight: 700;
        background-color: #f5f5f7;
      }
      .search-song-search-result-content {
        .search-song-search-result-item {
          padding: 5px 10px;
          cursor: pointer;
          &:hover {
            background-color: #f5f5f7;
          }
          .search-song-search-result-item-name {
            color: #507daf;
          }
        }
      }
    }
  }
}
</style>
