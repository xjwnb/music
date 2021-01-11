
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
            <keep-alive></keep-alive>
          </router-view> -->
          <div class="main-content">
            <router-view />
          </div>
        </el-main>
      </el-container>
      <el-footer>FOOTER</el-footer>
    </el-container>
  </div>
</template>


<script lang="ts">
import { defineComponent, watch } from "vue";
import { mapState } from "vuex";
import { ASIDE_NAV } from "@/store/state-types";

export default defineComponent({
  name: "MainLayout",
  setup(props, { attrs, slots, emit }) {},
  data() {
    return {
      navChildren: null, // 子导航内容
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
    let nowPath = this.$route.path;
    // 正则判断 path
    let path = this.formatPath(nowPath);
    let asideNav = this.filterAsideNavHandle(path);
    if (asideNav) {
      this.navChildren = asideNav.children;
    }
  },
  methods: {
    // header history go
    historyGo(direction: string) {
      let _this = this;
      switch (direction) {
        case "left":
          _this.$router.go(1);
          break;
        case "right":
          _this.$router.go(-1);
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
        position: absolute;
        top: 0;
        left: 12rem;
        right: 0;
        height: 100%;
        background-color: #fff;
        .el-menu {
          height: 3rem !important;
          .el-menu-item {
            height: 3rem !important;
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
      background-color: #e9eef3;
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
