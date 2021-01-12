/*
 * @Author: your name
 * @Date: 2021-01-10 13:58:49
 * @LastEditTime: 2021-01-12 17:32:09
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\recommend\index.ts
 */

import { request } from "@/http";

// 请求 banner 
export function getRecommendBanner() {
  return request({
    url: "/banner?type=0"
  })
}

// 推荐歌单
export function getPersonalizedSong() {
  return request({
    url: "/personalized?limit=10"
  })
}

// 最新音乐
export function getPersonalizedNewSong() {
  return request({
    url: "/personalized/newsong?limit=12"
  })
}