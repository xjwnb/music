/*
 * @Author: your name
 * @Date: 2021-01-20 13:13:32
 * @LastEditTime: 2021-01-20 13:15:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\RankingList\index.ts
 */
import { request } from "@/http";

// 获得排行榜
export function getToplist() {
  return request({
    url: "/toplist"
  })
}