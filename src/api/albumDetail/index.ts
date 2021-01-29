/*
 * @Author: your name
 * @Date: 2021-01-29 18:39:32
 * @LastEditTime: 2021-01-29 18:40:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\albumDetail\index.ts
 */

import { request } from "@/http";

export function getAlbumById(id: number) {
  return request({
    url: `/album?id=${id}`
  })
}