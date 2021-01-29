/*
 * @Author: your name
 * @Date: 2021-01-27 18:20:48
 * @LastEditTime: 2021-01-27 22:00:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\SearchKeyword\index.ts
 */
import { request } from "@/http";

export function searchKeywordGetResult(name: string, type: number, offset: number = 0) {
  return request({
    url: `/cloudsearch?keywords=${name}&type=${type}&limit=100&offset=${offset}`
  })
}