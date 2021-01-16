<!--
 * @Author: your name
 * @Date: 2021-01-13 21:11:43
 * @LastEditTime: 2021-01-16 18:57:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\SonglistsDetails\index.vue
-->

<template>
  <div class="songlists-details">
    <!-- 歌单信息 -->
    <div class="songlists-details-info">
      <div class="songlists-details-info-img">
        <el-image :src="coverImgUrl"></el-image>
      </div>
      <div class="songlists-details-info-content">
        <div class="songlists-details-info-name">
          <h1>{{ name }}</h1>
        </div>
        <div class="songlists-details-info-author">
          <el-image :src="avatarUrl"></el-image>
          <div class="songlists-details-info-nickName">{{ nickname }}</div>
          <div class="songlists-details-info-createTime">
            {{ createTimeFormat }}创建
          </div>
        </div>
        <div class="songlists-details-info-btn">
          <el-button>哈哈哈</el-button>
        </div>
        <div class="songlists-details-info-tags">标签：{{ tagFormat }}</div>
        <div class="songlists-details-info-msg">
          <div class="songlists-details-info-msg-trackCount">
            歌曲：{{ trackCount }}
          </div>
          <div class="songlists-details-info-msg-playCount">
            播放：{{ playCountFormat }}
          </div>
        </div>
        <div class="songlists-details-info-synopsis">
          <span>简介：</span>
          <span
            :class="isFoldDescription ? 'fold' : ''"
            v-html="description.replace(/(\s)+/g, '<br />')"
          ></span>
        </div>
      </div>
      <div
        @click="foldChange"
        :class="[
          'songlist-detail-description-show',
          isFoldDescription ? '' : 'rotate',
        ]"
      >
        <span class="iconfont icon-xiala1"></span>
      </div>
    </div>
    <!-- 歌单内容 -->
    <div class="songlist-detail-content">
      <!-- 标签 -->
      <div class="songlist-detail-content-tabs">
        <div
          :class="['songlist-detail-content-tab', currentTab === tab.alias ? 'active': '']"
          v-for="tab in tabsInfo"
          :key="tab.id"
          @click="currentTab = tab.alias"
        >
          {{ tab.tab }}
        </div>
      </div>
      <!-- 内容 -->
      <div v-show="currentTab==='songlist'" class="songlist-detail-content-songs">歌曲列表</div>
      <div v-show="currentTab==='comment'" class="songlist-detail-content-comment">评论</div>
    </div>
  </div>
</template>

<script lang="ts">
// 请求
import { getSongListsById, getSongDetailByIds } from "@/api/songlists";
// utils
import { numberFormat, numberToDateFormat } from "@/utils/numberFormat";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SonglistsDetails",
  data() {
    return {
      id: "" as string, // 歌单 id
      coverImgUrl: "", // 歌单图片 url
      createTime: "", // 歌单创建时间
      description: "", // 歌单描述
      name: "", // 歌单名称
      avatarUrl: "", // 作者头像 url
      playCount: 0, // 播放次数
      tags: [], // 歌单标签
      trackCount: 0, // 歌单中的歌曲数量
      trackIds: [], // 歌单中的歌曲 id 对象数组
      nickname: "", // 歌单作者昵称
      isFoldDescription: true, // 描述是否折叠
      songslist: [], // 歌曲数组
      tabsInfo: [
        // 标签信息
        {
          id: 1,
          tab: "歌曲列表",
          alias: "songlist",
        },
        {
          id: 2,
          tab: "评论",
          alias: "comment",
        },
      ],
      currentTab: "songlist", // 当前标签
    };
  },
  computed: {
    // 播放次数格式化
    playCountFormat() {
      let _this = this as any;
      return numberFormat(_this.playCount);
    },
    // 标签
    tagFormat() {
      let _this = this as any;
      let tags = _this.tags;
      return tags.join(" / ");
    },
    // 创建时间格式化
    createTimeFormat() {
      let _this = this as any;
      return numberToDateFormat(_this.createTime);
    },
  },
  mounted() {
    let _this = this as any;
    // params id
    let id = _this.$route.params.id;
    _this.id = id;
    // 请求数据
    getSongListsById(id).then((res) => {
      let data = (res as any).data;
      console.log(data);
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
        _this.avatarUrl = creator.avatarUrl;
        _this.coverImgUrl = coverImgUrl;
        _this.createTime = createTime;
        _this.description = description;
        _this.name = name;
        _this.playCount = playCount;
        _this.tags = tags;
        _this.trackCount = trackCount;
        _this.trackIds = trackIds;
        let idsArr: any[] = [];
        trackIds.forEach((id: any) => {
          (Array as any).prototype.push.call(idsArr, id.id);
        });
        // 通过 id 获取歌曲信息
        getSongDetailByIds(idsArr.join(",")).then((res) => {
          console.log(res);
        });
      }
    });
  },
  methods: {
    foldChange() {
      let _this = this as any;
      _this.isFoldDescription = !_this.isFoldDescription;
    },
  },
});
</script>

<style lang="less" scoped>
.songlists-details {
  display: flex;
  flex-direction: column;

  // margin: 0 7rem;

  // 歌单信息
  .songlists-details-info {
    display: flex;
    align-items: flex-start;

    .songlists-details-info-img {
      margin-right: 2rem;
      .el-image {
        width: 15rem;
        height: 15rem;
        border-radius: 0.7rem;
      }
    }
    .songlists-details-info-content {
      .songlists-details-info-name {
        font-size: 1.5rem;
        margin-bottom: 0.8rem;
        h1 {
          margin: 0;
        }
      }
      .songlists-details-info-createTime {
        font-size: 0.8rem;
      }

      .songlists-details-info-author {
        display: flex;
        align-items: center;
        margin: 0.7rem;
        .el-image {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          margin-right: 1rem;
        }
        .songlists-details-info-nickName {
          font-size: 0.7rem;
          margin-right: 1rem;
        }
      }
      .songlists-details-info-btn {
        margin-bottom: 0.8rem;
      }
      .songlists-details-info-tags {
        margin-bottom: 0.6rem;
      }
      .songlists-details-info-msg {
        display: flex;
        margin-bottom: 0.6rem;

        .songlists-details-info-msg-trackCount {
          margin-right: 0.6rem;
        }
      }
      .songlists-details-info-synopsis {
        display: flex;
      }
    }

    .songlist-detail-description-show {
      position: relative;
      top: 14rem;
      transition: all 0.5s;
      transform-origin: 50% 25%;
      cursor: pointer;
    }
    .rotate {
      transform: rotate(180deg);
    }
  }

  // tab
  .songlist-detail-content {
    .songlist-detail-content-tabs {
      display: flex;
      .songlist-detail-content-tab {
        padding: 0.7rem 1rem;
        cursor: pointer;

        &:hover {
          background-color: #dfdfdf;
        }
      }
      .active {
        border-bottom: 2px solid #e22d2d;
      }
    }
  }
}
.fold {
  // height: 2.8em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>