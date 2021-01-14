/*
 * @Author: your name
 * @Date: 2021-01-14 14:29:35
 * @LastEditTime: 2021-01-14 14:36:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\interface\public\audio.ts
 */
// 歌曲信息
export interface AudioInfoInterface {
  id: string,
  songName: string,
  artistName: string,
  playTime: number,
  picUrl: string
}