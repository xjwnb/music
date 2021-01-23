/*
 * @Author: your name
 * @Date: 2021-01-09 19:01:23
 * @LastEditTime: 2021-01-23 15:27:39
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \music\src\const\public\AsideNav\AsideNav.ts
 */

export const AsideNav = [
  {
    id: "1",
    path: "/discover",
    text: "发现音乐",
    children: [
      {
        id: "1-1",
        path: "/discover/recommend",
        text: "个性推荐"
      },
      {
        id: "1-2",
        path: "/discover/songSheet",
        text: "歌单"
      },
      {
        id: "1-3",
        path: "/discover/rankingList",
        text: "排行榜"
      },
      {
        id: "1-4",
        path: "/discover/singer",
        text: "歌手"
      },
     /*  {
        id: "1-5",
        path: "/discover/latestMusic",
        text: "最新音乐"
      }, */
    ]
  },
  /* {
    id: "2",
    link: "/video",
    text: "视频"
  } */
]