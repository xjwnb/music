/*
 * @Author: your name
 * @Date: 2021-01-08 16:28:55
 * @LastEditTime: 2021-01-29 17:14:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\router\index.ts
 */

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
// main layout
import MainLayout from "@/layout/public/MainLayout.vue";

const routes: Array<RouteRecordRaw> = [
  /*   {
      path: "/",
      name: "Home",
      component: Home
    }, */
  {
    path: '/',
    name: 'Layout',
    component: MainLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home
      },
      {
        path: "songlists/:id",  // 歌单
        name: "Songlists",
        component: () => import(/* webpackChunkName: "Songlists" */ "@/views/SonglistsDetails/index.vue")
      },
      {
        path: 'about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
      {
        path: "singerDetial/:id",
        name: "SingerDetail",
        component: () => import(/* webpackChunkName: "SingerDetail" */ "@/views/SingerDetail/index.vue")
      },
      {
        path: "albumDetail/:id",
        name: "AlbumDetail",
        component: () => import(/* webpackChunkName: "AlbumDetail" */ "@/views/AlbumDetail/index.vue")
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ "@/views/Login/Login.vue")
  },
  {
    path: "/video",
    name: "Video",
    component: MainLayout,
    // component: () => import(/* webpackChunkName: "video" */ "@/views/Video/index.vue")
    children: [
      {
        path: "",
        name: "VideoInfo",
        component: () => import(/* webpackChunkName: "video" */ "@/views/Video/index.vue")
      }
    ]
  },
  {
    path: "/discover",  // 发现音乐
    name: "Discover",
    component: MainLayout,
    // component: () => import(/* webpackChunkName: "video" */ "@/views/Video/index.vue")
    children: [
      {
        path: "",
        name: "DiscoverInfo",
        redirect: { name: "Recommend" },
        // component: () => import(/* webpackChunkName: "Recommend" */ "@/views/Recommend/index.vue")

      },
      {
        path: "recommend",  // 推荐
        name: "Recommend",
        component: () => import(/* webpackChunkName: "Recommend" */ "@/views/Recommend/index.vue"),
        meta: { keepAlive: true }
      },
      {
        path: "songSheet", // 歌单
        name: "SongSheet",
        component: () => import(/* webpackChunkName: "SongSheet"*/ "@/views/SongSheet/index.vue"),
        meta: { keepAlive: true }
      },
      {
        path: "rankingList", // 排行榜
        name: "RankingList",
        component: () => import(/* webpackChunkName: "RankingList" */ "@/views/RankingList/index.vue"),
        meta: { keepAlive: true }
      },
      {
        path: "singer", // 歌手
        name: "Singer",
        component: () => import(/* webpackChunkName: "Songer" */ "@/views/Singer/index.vue"),
        meta: { keepAlive: true }
      },
      {
        path: "latestMusic", // 最新音乐
        name: "LatestMusic",
        component: () => import(/* webpackChunkName: "LatestMusic" */ "@/views/LatestMusic/index.vue"),
        meta: { keepAlive: true }
      },
      {
        path: "search",
        name: "Search",
        component: () => import(/* webpackChunkName: "Search" */ "@/views/SearchKeyword/index.vue"),
        props: (route) => ({ query: route.query.keyword })
      }
    ]
  }
]

const router = createRouter({

  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory("/music/"),
  routes
})

export default router
