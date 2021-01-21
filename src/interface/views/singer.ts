/*
 * @Author: your name
 * @Date: 2021-01-20 18:55:09
 * @LastEditTime: 2021-01-21 19:30:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\interface\views\songer.ts
 */
export interface singerArtistListInterface {
  id: number,
  value: string,
  text: string,
  type: string
}

// 请求参数
export interface singerArtistListUrlParamInterface {
  type: string,
  area: string,
  initial: string,
  page: number
}

// 歌手show
export interface singerComShowInterface {
  id: number,
  name: string,
  picUrl: string
}