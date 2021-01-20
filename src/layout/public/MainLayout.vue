
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
                    <el-avatar :src="userInfo.profile.avatarUrl"></el-avatar>
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
              v-for="aside_info in ASIDE_NAV"
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
            <router-view></router-view>
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
import { defineComponent, reactive, ref, watch } from "vue";
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
// 播放器
import AudioPlayer from "@/common/AudioPlayer/index.vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "MainLayout",
  components: {
    AudioPlayer,
  },
  setup(props, { attrs, slots, emit }) {
    let isLogin = ref(false);
    let userInfo = reactive({});
    return {};
  },
  data() {
    return {
      navChildren: null, // 子导航内容
      isLogin: false, // 是否登录
      userInfo: {}, // 用户信息
    };
  },
  computed: {
    ...mapState([ASIDE_NAV]),
    navDefaultActive() {
      return (this as any).formatPath(this.$route.path);
    },
    navChildrenDefaultActive() {
      return this.$route.path;
    },
  },
  watch: {
    $route(to: any, from) {
      let toPath: string = to.path;
      // 正则判断 path
      let path = this.formatPath(toPath);
      let asideNav = this.filterAsideNavHandle(path);
      if (asideNav) {
        this.navChildren = asideNav.children;
      }
    },
  },
  mounted() {
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
  },
  methods: {
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
  },
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
          display: inline-block;
          .header-right-user-login {
            cursor: pointer;
            color: #8a8a8a;
            font-size: 0.9rem;
            &:hover {
              color: #535353;
            }
          }
          .header-right-user-info {
            .header-right-user-info-content {
              display: flex;
              align-items: center;
              cursor: pointer;
              .el-avatar {
                margin-right: 0.5rem;
              }
            }
          }
        }
      }
    }
    .header-right-user-info-logout {
      cursor: pointer;
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
</style>
