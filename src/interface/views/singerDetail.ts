/*
 * @Author: your name
 * @Date: 2021-01-22 14:32:40
 * @LastEditTime: 2021-01-22 17:06:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \music\src\interface\views\singerDetail.ts
 */

// 歌手信息接口
export interface artistInfoInterface {
  id: number,  // 歌手 id
  name: string,  // 姓名
  alias: string, // 英文姓名
  musicSize: number, // 单曲数
  albumSize: number, // 专辑数
  mvSize: number, // MV 数
  picUrl: string, // 歌手图片
}

// 歌曲列表信息
export interface songInfoInterface {
  id: number,
  name: string,
  index: string,
  time: string
}