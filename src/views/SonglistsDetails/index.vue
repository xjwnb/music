<!--
 * @Author: your name
 * @Date: 2021-01-13 21:11:43
 * @LastEditTime: 2021-01-29 21:05:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\views\SonglistsDetails\index.vue
-->

<template>
  <div class="songlists-details">
    <!-- 歌单信息 -->
    <div class="songlists-details-info">
      <div class="songlists-details-info-img">
        <el-image :src="coverImgUrls"></el-image>
      </div>
      <div class="songlists-details-info-content">
        <div class="songlists-details-info-name">
          <h1>{{ names }}</h1>
        </div>
        <div class="songlists-details-info-author">
          <el-image :src="avatarUrl"></el-image>
          <div class="songlists-details-info-nickName">{{ nickname }}</div>
          <div class="songlists-details-info-createTime">
            {{ createTimeFormat }}创建
          </div>
        </div>
        <!-- <div class="songlists-details-info-btn">
          <el-button>哈哈哈</el-button>
        </div> -->
        <div v-if="tagFormat" class="songlists-details-info-tags">标签：{{ tagFormat }}</div>
        <div class="songlists-details-info-msg">
          <div class="songlists-details-info-msg-trackCount">
            歌曲：{{ trackCounts }}
          </div>
          <div class="songlists-details-info-msg-playCount">
            播放：{{ playCountFormat }}
          </div>
        </div>
        <div class="songlists-details-info-synopsis">
          <span>简介：</span>
          <span
            :class="isFoldDescription ? 'fold' : ''"
            v-html="descriptions.replace(/(\s)+/g, '<br />')"
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
          :class="[
            'songlist-detail-content-tab',
            currentTab === tab.alias ? 'active' : '',
          ]"
          v-for="tab in tabsInfo"
          :key="tab.id"
          @click="tabChangeHandle(tab.alias)"
        >
          {{ tab.tab }}{{ tab.alias === "comment" ? commentCounts : "" }}
        </div>
      </div>
      <!-- 内容 -->
      <div
        v-show="currentTab === 'songlist'"
        class="songlist-detail-content-songs"
      >
        <el-table
          :data="songs"
          stripe
          style="width: 100%"
          @row-dblclick="dbTableClickHandle"
        >
          <el-table-column prop="num" width="180"> </el-table-column>
          <el-table-column prop="title" label="音乐标题" width="180">
          </el-table-column>
          <el-table-column prop="songer" label="歌手"></el-table-column>
          <el-table-column prop="album" label="专辑"></el-table-column>
          <el-table-column prop="playTimeFormat" label="时长"></el-table-column>
        </el-table>
      </div>
      <div
        v-show="currentTab === 'comment'"
        class="songlist-detail-content-comment"
      >
        最新评论（{{ commentCounts }}）
        <!-- 内容 -->
        <div class="songlist-detail-content-comment-list-content">
          <div
            v-for="commentData in currentCommentArray"
            class="songlist-detail-content-comment-content"
          >
            <div class="songlist-detail-content-comment-content-user-avatarUrl">
              <el-avatar :src="commentData.picUrl"></el-avatar>
            </div>
            <div class="songlist-detail-content-comment-content-detail">
              <div
                class="songlist-detail-content-comment-content-detail-content"
              >
                <span class="nickName-span">{{ commentData.nickName }}：</span>
                <span class="content-span">{{ commentData.content }}</span>
              </div>
              <div class="songlist-detail-content-comment-content-detail-time">
                <span class="time-span">{{
                  commentTimeFormat(commentData.time)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <el-pagination
          v-model:currentPage="currentPage"
          background
          layout="prev, pager, next"
          :total="commentCounts"
          :page-size="20"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// 请求
import {
  getSongListsById,
  getSongDetailByIds,
  getPlaylistCommentById,
} from "@/api/songlists";
// utils
import {
  numberFormat,
  numberToDateFormat,
  numberToTimeFormat,
  numberToTimeDistanceFormat,
} from "@/utils/numberFormat";
// vuex
import store from "@/store";
import {
  AUDIO_ID_CHANGE,
  AUDIO_LIST_ADD,
  AUDIO_INFO_CHANGE,
} from "@/store/mutation-types";
import { AUDIO_ID, AUDIO_INFO, AUDIO_LIST } from "@/store/state-types";
// interface
import { AudioInfoInterface } from "@/interface/public/audio";
// songlist interface
import {
  songlistInterface,
  songlistCommentInterface,
} from "@/interface/views/songlist";
// vue
import {
  defineComponent,
  getCurrentInstance,
  ref,
  reactive,
  onMounted,
  computed,
} from "vue";

export default defineComponent({
  name: "SonglistsDetails",
  /* data() {
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
      songs: [] as songlistInterface[], // 歌曲数组
      loading: null, // 加载
      commentCount: 0, // 评论数量
      currentPage: 1, // 当前页
      commentArray: [], // 评论数组
      currentCommentArray: [], // 当前页的评论
    };
  }, */
  setup() {
    const id = ref(""); // 歌单 id
    const coverImgUrls = ref(""); // 歌单图片 url
    const createTimes = ref(""); // 歌单创建时间
    const descriptions = ref(""); // 歌单描述
    const names = ref(""); // 歌单名称
    const avatarUrl = ref(""); // 作者头像 url
    const playCounts = ref(0); // 播放次数
    const tagss = ref([]); // 歌单标签
    const trackCounts = ref(0); // 歌单中的歌曲数量
    const trackIdss = ref([]); // 歌单中的歌曲 id 对象数组
    const nickname = ref(""); // 歌单作者昵称
    const isFoldDescription = ref(true); // 描述是否折叠
    const songslist = ref([]); // 歌曲数组
    const tabsInfo = reactive([
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
    ]);
    const currentTab = ref("songlist"); // 当前标签
    const songs = ref<songlistInterface[]>([]); // 歌曲数组
    const loading = ref<any | null>(null); // 加载
    const commentCounts = ref(0); // 评论数量
    const currentPage = ref(1); // 当前页
    const commentArray : any = ref([]); // 评论数组
    const currentCommentArray : any = ref([]); // 当前页的评论

    const instance: any = getCurrentInstance();
    const root = instance.ctx.$root;


    // computed
    // 播放次数格式化
    const playCountFormat = computed(() => {
      return numberFormat(playCounts.value);
    });
    // 标签
    const tagFormat = computed(() => {
      let tags1 = tagss.value;
      return tags1.join(" / ");
    });
    // 创建时间格式化
    const createTimeFormat = computed(() => {
      return numberToDateFormat(Number(createTimes.value));
    })

    // mounted
    onMounted(() => {
      // loading
      const loading = root.$loading({
        target: document.getElementsByClassName(
          "songlist-detail-content-songs"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      loading.value = loading;

      // params id
      let ids = root.$route.params.id;
      id.value = ids;
      // 请求数据
      getSongListsById(ids).then((res) => {
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
            commentCount,
          } = data.playlist;
          nickname.value = creator.nickname;
          avatarUrl.value = creator.avatarUrl;
          coverImgUrls.value = coverImgUrl;
          createTimes.value = createTime;
          descriptions.value = description;
          names.value = name;
          playCounts.value = playCount;
          tagss.value = tags;
          trackCounts.value = trackCount;
          trackIdss.value = trackIds;
          commentCounts.value = commentCount;
          // 歌曲 id 数组
          let idsArr: any[] = [];
          trackIds.forEach((id: any) => {
            (Array as any).prototype.push.call(idsArr, id.id);
          });
          // 通过 id 获取歌曲信息
          getSongDetailByIds(idsArr.join(",")).then((res) => {
            if ((res as any).status === 200) {
              let songsData = (res as any).data.songs;
              let songs1: songlistInterface[] = songsData.map(
                (song: any, index: number) => {
                  return {
                    num:
                      (index + 1).toString().length >= 2
                        ? (index + 1).toString()
                        : `0${index + 1}`,
                    id: song.id,
                    title: song.name,
                    picUrl: song.al.picUrl,
                    songer: song.ar[0].name,
                    album: song.al.name,
                    playTimeFormat: numberToTimeFormat(song.dt / 1000),
                    playTime: song.dt,
                  };
                }
              );
              songs.value = songs1;
              loading.value.close();
            }
          });
        }
      });
    });

    // methods
    // 展开歌单简介
    const foldChange =() => {
      isFoldDescription.value = !isFoldDescription.value;
    };
    // 表单行双击事件（播放）
    const dbTableClickHandle = (rowData: any): void  => {
      let { id, picUrl, songer, title, playTime } = rowData;
      let audioData: AudioInfoInterface;
      audioData = {
        id,
        songName: title,
        artistName: songer,
        playTime,
        picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id });
      store.commit(AUDIO_INFO_CHANGE, { audioInfo: audioData });
      store.commit(AUDIO_LIST_ADD, { audioData });
      root.$bus.emit("audioPlay");
    };
    // 切换标签事件
    const tabChangeHandle = (tabAlias: string) => {
      currentTab.value = tabAlias;
      let loading = root.$loading({
        target: document.getElementsByClassName(
          "songlist-detail-content-comment-list-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (!currentCommentArray.value[0]) {
        getPlaylistCommentById(id.value, 0).then((res) => {
          let commentArr: songlistCommentInterface[];
          let data = (res as any).data;
          let commentData: [] = data.comments;
          commentArr = commentData.map((comment: any, index: any) => {
            let commentInfo = {
              nickName: comment.user.nickname,
              picUrl: comment.user.avatarUrl,
              content: comment.content,
              likedCount: comment.likedCount,
              replied: comment.beReplied,
              time: comment.time,
            };
            commentArray.value[index] = commentInfo;
            return commentInfo;
          });
          currentCommentArray.value = commentArr;
          loading.close();
          // _this.commentArray.push(commentArr);
        });
      }
      loading.close();
    };
    // 评论分页事件
    const handleSizeChange = (val: number) => {
      console.log(`每页 ${val} 条`);
    };
    const handleCurrentChange = (val: number) => {
      let loading = root.$loading({
        target: document.getElementsByClassName(
          "songlist-detail-content-comment-list-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      currentPage.value = val;
      if (commentArray.value[(val - 1) * 20] === undefined) {
        getPlaylistCommentById(id.value, val - 1).then((res) => {
          let commentArr: songlistCommentInterface[];
          let data = (res as any).data;
          let commentData: [] = data.comments;
          commentArr = commentData.map((comment: any, index: number) => {
            let commentInfo = {
              nickName: comment.user.nickname,
              picUrl: comment.user.avatarUrl,
              content: comment.content,
              likedCount: comment.likedCount,
              replied: comment.beReplied,
              time: comment.time,
            };
            commentArray.value[(val - 1) * 20 + index] = commentInfo;
            return commentInfo;
          });
          currentCommentArray.value = commentArr;
          loading.close();
          // _this.commentArray.push(commentArr);
        });
      } else {
        let currentPageNum = commentCounts.value - (val - 1) * 20;
        currentCommentArray.value = [];
        if (currentPageNum > 20) {
          for (let i = 0, l = 20; i < l; i++) {
            currentCommentArray.value[i] =
              commentArray.value[(val - 1) * 20 + i];
          }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            currentCommentArray.value[ii] =
              commentArray.value[(val - 1) * 20 + ii];
          }
        }
        loading.close();
      }
    };
    // 格式化 评论时间
    const commentTimeFormat = (time: number) => {
      return numberToTimeDistanceFormat(time);
    };


    return {
      id, // 歌单 id
      coverImgUrls, // 歌单图片 url
      createTimes, // 歌单创建时间
      descriptions, // 歌单描述
      names, // 歌单名称
      avatarUrl, // 作者头像 url
      playCounts, // 播放次数
      tagss, // 歌单标签
      trackCounts, // 歌单中的歌曲数量
      trackIdss, // 歌单中的歌曲 id 对象数组
      nickname, // 歌单作者昵称
      isFoldDescription, // 描述是否折叠
      songslist, // 歌曲数组
      tabsInfo,
      currentTab, // 当前标签
      songs, // 歌曲数组
      loading, // 加载
      commentCounts, // 评论数量
      currentPage, // 当前页
      commentArray, // 评论数组
      currentCommentArray, // 当前页的评论

      // computed
      playCountFormat, // 播放次数格式化
      tagFormat, // 标签
      createTimeFormat, // 创建时间格式化

      // methods
      foldChange, // 展开歌单简介
      dbTableClickHandle, // 表单行双击事件（播放）
      tabChangeHandle, // 切换标签事件
      handleSizeChange,
      handleCurrentChange,
      commentTimeFormat, // 格式化 评论时间

    }


    
  },
  /* computed: {
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
  }, */
 /*  mounted() {
    let _this = this as any;
    // loading
    console.log("this", this);
    const loading = _this.$loading({
      target: document.getElementsByClassName(
        "songlist-detail-content-songs"
      )[0],
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    _this.loading = loading;

    // params id
    let id = _this.$route.params.id;
    _this.id = id;
    // 请求数据
    getSongListsById(id).then((res) => {
      let data = (res as any).data;
      if (data.code === 200) {
        console.log(data);
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
          commentCount,
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
        _this.commentCount = commentCount;
        // 歌曲 id 数组
        let idsArr: any[] = [];
        trackIds.forEach((id: any) => {
          (Array as any).prototype.push.call(idsArr, id.id);
        });
        // 通过 id 获取歌曲信息
        getSongDetailByIds(idsArr.join(",")).then((res) => {
          if ((res as any).status === 200) {
            let songsData = (res as any).data.songs;
            let songs: songlistInterface[] = songsData.map(
              (song: any, index: number) => {
                return {
                  num:
                    (index + 1).toString().length >= 2
                      ? (index + 1).toString()
                      : `0${index + 1}`,
                  id: song.id,
                  title: song.name,
                  picUrl: song.al.picUrl,
                  songer: song.ar[0].name,
                  album: song.al.name,
                  playTimeFormat: numberToTimeFormat(song.dt / 1000),
                  playTime: song.dt,
                };
              }
            );
            _this.songs = songs;
            _this.loading.close();
          }
        });
      }
    });
  }, */
  // methods: {
    /* // 展开歌单简介
    foldChange() {
      let _this = this as any;
      _this.isFoldDescription = !_this.isFoldDescription;
    },
    // 表单行双击事件（播放）
    dbTableClickHandle(rowData: any): void {
      let { id, picUrl, songer, title, playTime } = rowData;
      let audioData: AudioInfoInterface;
      audioData = {
        id,
        songName: title,
        artistName: songer,
        playTime,
        picUrl,
      };
      store.commit(AUDIO_ID_CHANGE, { id });
      store.commit(AUDIO_INFO_CHANGE, { audioInfo: audioData });
      store.commit(AUDIO_LIST_ADD, { audioData });
      (this as any).$bus.emit("audioPlay");
    },
    // 切换标签事件
    tabChangeHandle(tabAlias: string) {
      let _this = this as any;
      _this.currentTab = tabAlias;
      let loading = _this.$loading({
        target: document.getElementsByClassName(
          "songlist-detail-content-comment-list-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (!_this.currentCommentArray[0]) {
        getPlaylistCommentById(_this.id, 0).then((res) => {
          let commentArr: songlistCommentInterface[];
          let data = (res as any).data;
          let commentData: [] = data.comments;
          commentArr = commentData.map((comment: any, index: any) => {
            let commentInfo = {
              nickName: comment.user.nickname,
              picUrl: comment.user.avatarUrl,
              content: comment.content,
              likedCount: comment.likedCount,
              replied: comment.beReplied,
              time: comment.time,
            };
            _this.commentArray[index] = commentInfo;
            return commentInfo;
          });
          _this.currentCommentArray = commentArr;
          loading.close();
          // _this.commentArray.push(commentArr);
        });
      }
      loading.close();
    },
    // 评论分页事件
    handleSizeChange(val: number) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val: number) {
      let _this = this as any;
      let loading = _this.$loading({
        target: document.getElementsByClassName(
          "songlist-detail-content-comment-list-content"
        )[0],
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      _this.currentPage = val;
      if (_this.commentArray[(val - 1) * 20] === undefined) {
        getPlaylistCommentById(_this.id, val - 1).then((res) => {
          let commentArr: songlistCommentInterface[];
          let data = (res as any).data;
          let commentData: [] = data.comments;
          commentArr = commentData.map((comment: any, index: number) => {
            let commentInfo = {
              nickName: comment.user.nickname,
              picUrl: comment.user.avatarUrl,
              content: comment.content,
              likedCount: comment.likedCount,
              replied: comment.beReplied,
              time: comment.time,
            };
            _this.commentArray[(val - 1) * 20 + index] = commentInfo;
            return commentInfo;
          });
          _this.currentCommentArray = commentArr;
          loading.close();
          // _this.commentArray.push(commentArr);
        });
      } else {
        let currentPageNum = _this.commentCount - (val - 1) * 20;
        _this.currentCommentArray = [];
        if (currentPageNum > 20) {
          for (let i = 0, l = 20; i < l; i++) {
            _this.currentCommentArray[i] =
              _this.commentArray[(val - 1) * 20 + i];
          }
        } else {
          for (let ii = 0, ll = currentPageNum; ii < ll; ii++) {
            _this.currentCommentArray[ii] =
              _this.commentArray[(val - 1) * 20 + ii];
          }
        }
        loading.close();
      }
    },
    // 格式化 评论时间
    commentTimeFormat(time: number) {
      return numberToTimeDistanceFormat(time);
    }, */
  // },
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
      margin: 2rem 0;
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
    // 评论内容
    .songlist-detail-content-comment {
      .songlist-detail-content-comment-list-content {
        .songlist-detail-content-comment-content {
          display: flex;
          padding: 1rem 0;
          border-bottom: 1px solid #c9c9c9;
          .songlist-detail-content-comment-content-user-avatarUrl {
            margin-right: 1rem;
          }
          .songlist-detail-content-comment-content-detail {
            .songlist-detail-content-comment-content-detail-content {
              span {
                font-size: 0.8rem;
              }
            }
            .songlist-detail-content-comment-content-detail-time {
              .time-span {
                font-size: 0.7rem;
                color: #9e9e9e;
              }
            }
          }
        }
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