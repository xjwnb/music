/*
 * @Author: your name
 * @Date: 2021-01-16 19:01:40
 * @LastEditTime: 2021-01-16 19:09:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\interface\views\songlist.ts
 */
export interface songlistInterface {
  num: string, // 歌曲排序
  id: string,    // 歌曲 id
  title: string,  // 歌曲名称
  songer: string,  // 歌手
  Album: string,  // 专辑
  playTime: string // 时长
}