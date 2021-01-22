/*
 * @Author: your name
 * @Date: 2021-01-22 13:40:36
 * @LastEditTime: 2021-01-22 18:55:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\api\SingerDetail\index.ts
 */

import { request } from "@/http";


// 获得歌手部分信息和热门歌曲
export function getArtistInfo(id: number) {
  return request({
    url: `/artists?id=${id}`
  })
}

// 获取歌手描述信息
export function getArtistDescInfo(id: number) {
  return request({
    url: `/artist/desc?id=${id}`
  })
}

// 获取专辑基本信息
export function getArtistAlbumInfo(id: number, page: number) {
  return request({
    url: `/artist/album?id=${id}&limit=1&offset=${page - 1}`
  })
}

// 获取专辑内容
export function getArtistAlbum(id: number) {
  return request({
    url: `/album?id=${id}`
  })
}