/*
 * @Author: your name
 * @Date: 2021-01-18 12:51:25
 * @LastEditTime: 2021-01-19 11:24:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\topPlaylist\index.ts
 */
import { request } from "@/http";

// 
export function getTopPlaylist(pageNum: number, tag: string = '全部') {
  return request({
    url: `/top/playlist?cat=${tag}&limit=100&offset=${(pageNum - 1) * 100}`
  })
}


// hot 歌曲分类
export function getPlaylistHot() {
  return request({
    url: `/playlist/hot`
  })
}

// 获取精品歌单
export function getPlaylistHighquality(tag: string = '全部') {
  return request({
    url: `/top/playlist/highquality?limit=1&cat=${tag}`
  })
}

// all 歌曲分类
export function getPlaylistCatlist() {
  return request({
    url: `/playlist/catlist`
  })
}