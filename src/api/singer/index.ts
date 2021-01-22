/*
 * @Author: your name
 * @Date: 2021-01-20 22:39:14
 * @LastEditTime: 2021-01-22 12:04:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\singer\index.ts
 */

import { request } from "@/http";
// 接口
import { singerArtistListUrlParamInterface } from "@/interface/views/singer";

// 获取歌手列表
export function getArtistList(payload: singerArtistListUrlParamInterface) {
  return request({
    url: `/artist/list?type=${payload.type}&area=${payload.area}&initial=${payload.initial}&offset=${(Number(payload.page) - 1)*30}`
  })
}