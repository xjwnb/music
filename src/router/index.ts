
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
        path: 'about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },
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
    path: "/discover",
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
        path: "recommend",
        name: "Recommend",
        component: () => import(/* webpackChunkName: "Recommend" */ "@/views/Recommend/index.vue")
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
