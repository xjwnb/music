/*
 * @Author: your name
 * @Date: 2021-01-23 18:51:30
 * @LastEditTime: 2021-01-24 14:41:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\audioInfo\index.ts
 */
import { request } from "@/http";

// 请求歌曲歌词
export function getSongLyric(id: number) {
  return request({
    url: `/lyric?id=${id}`
  })
}