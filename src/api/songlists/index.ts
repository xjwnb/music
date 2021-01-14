/*
 * @Author: your name
 * @Date: 2021-01-13 21:23:15
 * @LastEditTime: 2021-01-13 21:23:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\songlists\index.ts
 */
import { request } from "@/http";

// 请求 banner 
export function getRecommendBanner() {
  return request({
    url: "/banner?type=0"
  })
}
