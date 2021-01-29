/*
 * @Author: your name
 * @Date: 2021-01-26 16:38:59
 * @LastEditTime: 2021-01-26 21:11:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\search\index.ts
 */

import { request } from "@/http";
// 搜索结果
export function search(val: string) {
  return request({
    url: `/search/suggest?keywords=${val}`
  })
}
// 搜索热门
export function searchHot() {
  return request({
    url: `/search/hot/detail`
  })
}