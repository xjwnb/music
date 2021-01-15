/*
 * @Author: your name
 * @Date: 2021-01-13 21:23:15
 * @LastEditTime: 2021-01-14 15:16:38
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
