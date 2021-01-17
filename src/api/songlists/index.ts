/*
 * @Author: your name
 * @Date: 2021-01-13 21:23:15
 * @LastEditTime: 2021-01-17 15:21:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\songlists\index.ts
 */
import { request } from "@/http";

// 请求 banner 
export function getSongListsById(id: string) {
  return request({
    url: `/playlist/detail?id=${id}`
  })
}

// 利用 id 请求获取音乐信息
export function getSongDetailByIds(id: string) {
  return request({
    url: `/song/detail?ids=${id}`
  })
}

// 利用 id 请求获得歌单评论
export function getPlaylistCommentById(id: string, pageNum: number) {
  return request({
    url: `/comment/playlist?id=${id}&offset=${pageNum * 20}`
  })
}